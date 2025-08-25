import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './auth.model';
import { Model } from 'mongoose';
import { WorkerSignupDto } from './dto/workerSignup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { WorkerService } from 'src/worker/worker.service';
import { EmployerService } from 'src/employer/employer.service';
import { AgencySignupDto } from './dto/agencySignup.dto';
import { EmployerSignupDto } from './dto/EmployerSignup.dto';
import { AgencyService } from 'src/agency/agency.service';
import { FilesService } from 'src/files/files.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly workerService: WorkerService,
    private readonly employerService: EmployerService,
    private readonly agencyService: AgencyService,
    private readonly filesService: FilesService,
  ) {}
  //MARK: signup
  async signup(body: WorkerSignupDto | EmployerSignupDto | AgencySignupDto) {
    const existingUser = await this.getUserByEmail(body.email);
    if (existingUser) {
      throw new HttpException('User already exists', 409);
    }
    if (body.password !== body.confirmPassword) {
      throw new HttpException('Passwords do not match', 400);
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const { customAlphabet } = await import('nanoid');
    const nanoid = customAlphabet('1234567890', 6);
    const code = nanoid();

    const authData = {
      email: body.email,
      password: hashedPassword,
      code,
    };
    const newUser = new this.authModel(authData);
    let displayName = '';
    await newUser.save();
    if (body.role === 'worker') {
      const { email, password, confirmPassword, ...workerData } = body;
      displayName = (workerData as WorkerSignupDto).firstName;
      await this.workerService.createWorkerWithUserId(newUser._id.toString(), workerData);
    } else if (body.role === 'employer') {
      const { email, password, confirmPassword, ...employerData } = body;
      displayName = (employerData as EmployerSignupDto).firstName;
      await this.employerService.createEmployerWithUserId(newUser._id.toString(), employerData);
    } else if (body.role === 'agency') {
      const { email, password, confirmPassword, ...agencyData } = body;
      displayName = (agencyData as AgencySignupDto).agencyName;
      await this.agencyService.createAgencyWithUserId(newUser._id.toString(), agencyData);
    }

    await this.mailService.sendWelcomeEmail(body.email, displayName, code);

    return {
      message: 'User created successfully',
      user: {
        email: newUser.email,
      },
    };
  }
  //MARK: verifyEmail
  async verifyEmail(email: string, code: string) {
    const user = await this.authModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    if (user.isVerified) {
      throw new HttpException('Email already verified', 400);
    }
    if (code !== user.code) {
      throw new HttpException('Invalid verification code', 400);
    }
    user.isVerified = true;
    await user.save();
    return {
      message: 'Email verified successfully',
    };
  }
  //MARK: login
  async login(body: LoginDto, user: any) {
    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }
    const token = this.jwtService.sign({
      userId: user._id,
      role: user.role,
      email: user.email,
    });
    user.token = token;
    const updatedUser = await this.authModel.findByIdAndUpdate(
      user._id,
      {
        token,
      },
      { new: true },
    );
    return { user: updatedUser, token };
  }
  //MARK: getUserByEmail
  async getUserByEmail(email: string): Promise<Auth | null> {
    return this.authModel.findOne({ email });
  }
  //MARK: validateUser
  async validateUser(email: string, password: string): Promise<Auth | null> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  //MARK: validateOAuthUser
  async validateOAuthUser(profile: any, role: string) {
    const { _json } = profile;
    console.log(_json);
    let user = await this.authModel.findOne({ email: _json.email });
    let token;
    if (!user) {
      const newUser = new this.authModel({
        email: _json.email,
        isVerified: true,
        role,
      });
      if (role === 'worker') {
        await this.workerService.createWorkerWithUserId(newUser._id.toString(), { firstName: _json.given_name });
      } else if (role === 'employer') {
        await this.employerService.createEmployerWithUserId(newUser._id.toString(), {
          firstName: _json.given_name,
        });
      } else if (role === 'agency') {
        await this.agencyService.createAgencyWithUserId(newUser._id.toString(), { agencyName: _json.given_name });
      }
      token = this.jwtService.sign({
        userId: newUser._id,
        email: newUser.email,
        role,
      });
      newUser.token = token;
      await newUser.save();
      return newUser;
    }
    token = this.jwtService.sign({ userId: user._id, email: user.email });
    const userUpdate = await this.authModel.findOneAndUpdate(
      { email: _json.email },
      { token },
      { new: true },
    );
    return userUpdate;
  }
  //MARK: refreshToken
  async refreshToken(token: string) {
    const user = await this.authModel.findOne({ token });
    console.log(token);
    if (!user) {
      throw new HttpException('Invalid token', 401);
    }
    const newToken = this.jwtService.sign({
      userId: user._id,
      role: user.role,
      email: user.email,
    });
    user.token = newToken;
    await user.save();
    return {
      message: 'Token refreshed successfully',
      token: newToken,
      user: {
        email: user.email,
      },
    };
  }

  //MARK: getUserByToken
  async getUserByToken(token: string): Promise<Auth | null> {
    const user = await this.authModel.findOne({ token });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  //MARK: updateUser
  async updateUser(userId: string, updateData: any) {
    let currentUser: any;
    try {
      // Get the current user
      currentUser = await this.authModel.findById(userId);
      if (!currentUser) {
        throw new HttpException('User not found', 404);
      }

      // Handle file updates first
      await this.handleFileUpdates(userId, currentUser.role, updateData);

      // Update user profile based on role
      await this.updateUserProfile(userId, currentUser.role, updateData);

      // Get updated user
      const updatedUser = await this.authModel.findById(userId);
      return {
        message: 'User updated successfully',
        user: updatedUser,
      };
    } catch (error) {
      // Rollback file changes if needed
      if (currentUser) {
        await this.rollbackFileChanges(userId, currentUser.role);
      }
      throw error;
    }
  }

  //MARK: updateUserProfile
  private async updateUserProfile(userId: string, role: string, updateData: any) {
    if (role === 'worker' && updateData.workerData) {
      await this.workerService.updateWorker(userId, updateData.workerData);
    } else if (role === 'employer' && updateData.employerData) {
      await this.employerService.updateEmployer(userId, updateData.employerData);
    } else if (role === 'agency' && updateData.agencyData) {
      await this.agencyService.updateAgency(userId, updateData.agencyData);
    }
  }

  //MARK: handleFileUpdates
  private async handleFileUpdates(userId: string, role: string, updateData: any) {
    const urlsToDelete: string[] = [];

    // common profile picture replacement
    if (updateData.profilePicture && updateData.profilePictureOldUrl) {
      urlsToDelete.push(updateData.profilePictureOldUrl);
    }

    // generic filesToDelete fallback
    if (Array.isArray(updateData.filesToDelete)) {
      urlsToDelete.push(...updateData.filesToDelete);
    }

    if (role === 'worker' && updateData.workerData) {
      const wd = updateData.workerData;
      if (Array.isArray(wd.documentsToDelete)) urlsToDelete.push(...wd.documentsToDelete);
      if (wd.resume && wd.resumeOldUrl) urlsToDelete.push(wd.resumeOldUrl);
      if (wd.profilePicture && wd.profilePictureOldUrl)
        urlsToDelete.push(wd.profilePictureOldUrl);
    } else if (role === 'employer' && updateData.employerData) {
      const ed = updateData.employerData;
      if (Array.isArray(ed.documentsToDelete)) urlsToDelete.push(...ed.documentsToDelete);
      if (ed.profilePicture && ed.profilePictureOldUrl)
        urlsToDelete.push(ed.profilePictureOldUrl);
    } else if (role === 'agency' && updateData.agencyData) {
      const ad = updateData.agencyData;
      if (Array.isArray(ad.documentsToDelete)) urlsToDelete.push(...ad.documentsToDelete);
      if (ad.logo && ad.logoOldUrl) urlsToDelete.push(ad.logoOldUrl);
      if (ad.businessLicense && ad.businessLicenseOldUrl)
        urlsToDelete.push(ad.businessLicenseOldUrl);
    }

    if (urlsToDelete.length > 0) {
      await this.filesService.deleteFiles(userId, urlsToDelete);
    }
  }

  //MARK: extractFilesFromUpdateData
  private extractFilesFromUpdateData(updateData: any, role: string): string[] {
    const files: string[] = [];
    
    if (updateData.profilePicture) {
      files.push(updateData.profilePicture);
    }
    
    if (role === 'worker' && updateData.workerData) {
      if (updateData.workerData.documents) {
        files.push(...updateData.workerData.documents);
      }
      if (updateData.workerData.resume) {
        files.push(updateData.workerData.resume);
      }
    } else if (role === 'employer' && updateData.employerData) {
      if (updateData.employerData.documents) {
        files.push(...updateData.employerData.documents);
      }
    } else if (role === 'agency' && updateData.agencyData) {
      if (updateData.agencyData.documents) {
        files.push(...updateData.agencyData.documents);
      }
      if (updateData.agencyData.logo) {
        files.push(updateData.agencyData.logo);
      }
      if (updateData.agencyData.businessLicense) {
        files.push(updateData.agencyData.businessLicense);
      }
    }
    
    return files;
  }

  //MARK: getCurrentUserFiles
  private async getCurrentUserFiles(userId: string, role: string): Promise<string[]> {
    try {
      // Get all user files from FilesService
      const userFiles = await this.filesService.listUserFiles(userId);
      
      // Extract file URLs from the response
      const fileUrls: string[] = [];
      Object.values(userFiles).forEach((file: any) => {
        if (file && file.url) {
          fileUrls.push(file.url);
        }
      });
      
      return fileUrls;
    } catch (error) {
      console.error('Error getting user files:', error);
      return [];
    }
  }

  //MARK: rollbackFileChanges
  private async rollbackFileChanges(userId: string, role: string) {
    // TODO: Implement rollback logic for failed file operations
    console.log(`Rolling back file changes for user: ${userId}, role: ${role}`);
  }

  //MARK: getUserById
  async getUserById(userId: string): Promise<Auth | null> {
    return this.authModel.findById(userId);
  }

  //MARK: deleteUser
  async deleteUser(userId: string, requestingUser: any) {
    // Check if requesting user is admin
    if (requestingUser.role !== 'admin') {
      throw new HttpException('Unauthorized: Admin access required', 403);
    }

    const user = await this.authModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    // Delete user profile based on role
    if (user.role === 'worker') {
      await this.workerService.deleteWorker(userId);
    } else if (user.role === 'employer') {
      await this.employerService.deleteEmployer(userId);
    } else if (user.role === 'agency') {
      await this.agencyService.deleteAgency(userId);
    }

    // Delete auth record
    await this.authModel.findByIdAndDelete(userId);

    return {
      message: 'User deleted successfully',
    };
  }

  //MARK: replaceUserFile (multipart)
  async replaceUserFile(
    userId: string,
    label: string,
    type: 'picture' | 'documents',
    file: Express.Multer.File,
    issuanceDate?: Date,
    expirationDate?: Date,
  ) {
    // fetch existing file by label
    const filesByLabel = await this.filesService.listUserFiles(userId);
    const existing = filesByLabel?.[label];

    if (existing && existing.url) {
      // replace (delete old + upload new + persist)
      return this.filesService.replaceFile(
        userId,
        existing.url,
        file,
        type,
        label,
        issuanceDate || new Date(),
        expirationDate,
      );
    }

    // no existing -> just upload new
    const created = await this.filesService.uploadFile(
      userId,
      file,
      type,
      label,
      issuanceDate || new Date(),
      expirationDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    );

    return { message: 'File uploaded successfully', newFile: created };
  }
}
