import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, Role, status } from './auth.model';
import { Model, Types } from 'mongoose';
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
    console.log('auth service body', body);
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
      userName: body.email.split('@')[0],
      code,
      role: body.role,
      method: 'local',
      name: (body as any).name,
    };
    console.log('auth service authData', authData);
    const newUser = new this.authModel(authData);
    console.log('auth service newUser', newUser);
    let displayName = '';
    console.log('auth service newUser', newUser);
    if (body.role === 'worker') {
      const { password, confirmPassword, ...workerData } = body;
      displayName = (workerData as WorkerSignupDto).name;
      const worker = await this.workerService.createWorker({
        ...workerData,
        userId: newUser._id,
      });
      newUser.worker = worker._id;
    } else if (body.role === 'employer') {
      const { password, confirmPassword, ...employerData } = body;
      displayName = (employerData as EmployerSignupDto).userName;
      const employer = await this.employerService.createEmployer({
        ...employerData,
        userId: newUser._id,
      });
      newUser.employer = employer._id;
    } else if (body.role === 'agency') {
      const { password, confirmPassword, ...agencyData } = body;
      const agency = await this.agencyService.createAgency({
        ...agencyData,
        userId: newUser._id,
      });
      newUser.agency = agency._id;
    }

    await this.mailService.sendEmail(
      body.email,
      displayName,
      code,
      'Verify Your Email',
      'verification-code',
      'https://res.cloudinary.com/doou4eolq/image/upload/v1754270131/logo_st60zo.png',
    );
    await newUser.save();

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
    if (!user || !user.isVerified) {
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
      if (!_json.email.endsWith('@gmail.com')) {
        throw new HttpException('Only @gmail.com accounts are allowed', 400);
      }
      const newUser = new this.authModel({
        email: _json.email,
        isVerified: true,
        role,
        method: 'google',
        userName: _json.email.split('@')[0], // ahmed@gmail.com -> ahmed
        name: _json.given_name,
      });
      if (role === Role.WORKER) {
        const worker = await this.workerService.createWorker({
          email: _json.email,
          method: 'google',
          name: _json.given_name,
          profilePicture: {
            url: _json.picture,
          },
          userName: _json.email.split('@')[0],
          userId: newUser._id,
        });
        await this.workerService.createWorkerWithUserId(
          newUser._id.toString(),
          { firstName: _json.given_name },
        );
      } else if (role === 'employer') {
        await this.employerService.createEmployerWithUserId(
          newUser._id.toString(),
          {
            firstName: _json.given_name,
            userId: newUser._id,
          },
        );
      } else if (role === 'agency') {
        const agency = await this.agencyService.createAgency({
          agencyName: _json.given_name,
          userId: newUser._id,
        });
        newUser.agency = agency._id;
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
    token = this.jwtService.sign({ userId: user._id, email: user.email, role });
    const userUpdate = await this.authModel.findOneAndUpdate(
      { email: _json.email },
      { token, role },
      { new: true },
    );
    console.log('userUpdate', userUpdate);
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
  async getUserByToken(token: string): Promise<any> {
    const user = await this.authModel
      .findOne({ token })
      .populate('worker')
      .populate('employer')
      .populate('agency');
    if (!user) {
      console.log('User not found');
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  //MARK: approveUser
  async approveUser(userId: string) {
    const user = await this.authModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    user.status = status.APPROVED;
    await user.save();

    return {
      message: 'User approved successfully',
    };
  }

  //MARK: getUserById
  async getUserById(userId: string): Promise<Auth | null> {
    return this.authModel.findById(userId);
  }

  //MARK: deleteUserFull Name
  async deleteUser(userId: string, requestingUser: any) {
    // Check if requesting user is admin
    if (requestingUser.role !== Role.ADMIN) {
      throw new HttpException('Unauthorized: Admin access required', 403);
    }

    const user = await this.authModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    // Delete user profile based on role
    if (user.role === Role.WORKER) {
      await this.workerService.deleteWorker(userId);
    } else if (user.role === Role.EMPLOYER) {
      await this.employerService.deleteEmployer(userId);
    } else if (user.role === Role.AGENCY) {
      await this.agencyService.deleteAgency(userId);
    }

    // Delete auth record
    await this.authModel.findByIdAndDelete(userId);

    return {
      message: 'User deleted successfully',
    };
  }

  // //MARK: replaceUserFile (multipart)
  // async replaceUserFile(
  //   userId: string,
  //   label: string,
  //   type: 'picture' | 'documents',
  //   file: Express.Multer.File,
  //   issuanceDate?: Date,
  //   expirationDate?: Date,
  // ) {
  //   // fetch existing file by label
  //   const filesByLabel = await this.filesService.listUserFiles(userId);
  //   const existing = filesByLabel?.[label];

  //   if (existing && existing.url) {
  //     // replace (delete old + upload new)
  //     await this.filesService.deleteFileByUrl(userId, existing.url);
  //   }

  //   // upload new file
  //   const created = await this.filesService.uploadFile(
  //     userId,
  //     'worker', // role - this should be determined from user context
  //     file,
  //     type,
  //     label,
  //   );

  //   return { message: 'File uploaded successfully', newFile: created };
  // }
  //MARK: signatureUploaded
  async signatureUploaded(userId: Types.ObjectId) {
    const user = await this.authModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    user.signature = true;
    await user.save();
    return { message: 'Signature uploaded successfully' };
  }
  //MARK: updateProfilePhoto
  async updateProfilePhoto(
    userId: Types.ObjectId,
    url: string,
    key: string,
    role: string,
  ) {
    const user = await this.authModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    if (role === Role.WORKER) {
      await this.workerService.updateWorker(userId, {
        profilePicture: { url, s3Key: key },
      });
    } else if (role === Role.EMPLOYER) {
      await this.employerService.updateEmployer(userId, {
        profilePicture: { url, s3Key: key },
      });
    } else if (role === Role.AGENCY) {
      await this.agencyService.updateAgency(userId, {
        profilePicture: { url, s3Key: key },
      });
    }
    await user.save();
    return { message: 'Profile photo updated successfully' };
  }
}
