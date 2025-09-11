import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, Role } from './auth.model';
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
import { AdminService } from 'src/admin/admin.service';
import { Worker } from 'src/worker/worker.model';
import { Employer } from 'src/employer/employer.model';
import { Agency } from 'src/agency/agency.model';
import { status } from './auth.model';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly workerService: WorkerService,
    private readonly employerService: EmployerService,
    private readonly agencyService: AgencyService,
    private readonly adminService: AdminService,
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
    console.log('email', email);
    return this.authModel.findOne({ email });
  }
  //MARK: validateUser
  async validateUser(email: string, password: string): Promise<Auth | null> {
    const user = await this.getUserByEmail(email);
    console.log('user', user);
    if (!user || !user.isVerified) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('isPasswordValid', isPasswordValid);
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
        newUser.worker = worker._id as any;
      } else if (role === Role.EMPLOYER) {
        const employer = await this.employerService.createEmployerWithUserId(
          newUser._id.toString(),
          {
            userName: _json.given_name,
            method: 'google',
            userId: newUser._id,
          },
        );
        newUser.employer = employer._id as any;
      } else if (role === Role.AGENCY) {
        const agency = await this.agencyService.createAgency({
          userName: _json.given_name,
          userId: newUser._id,
        });
        newUser.agency = agency._id as any;
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
      .populate('agency')
      .populate('admin')
      .select(
        '-password -_id -code -token -createdAt -updatedAt -isVerified -method',
      );
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
  async updateUser(user: any, updateData: any) {
    console.log('updateData', updateData);
    const updatedUser = await this.authModel.findOneAndUpdate(
      { email: user.email },
      {
        name: updateData.name,
      },
      {
        new: true,
      },
    );
    console.log('updatedUser', updatedUser);
    console.log('user', user);
    if (user.role === Role.WORKER) {
      if (!updatedUser?.worker) {
        throw new HttpException('Worker not found', 404);
      }
      console.log('going to worker service');
      await this.workerService.updateWorker(
        updatedUser?.worker._id,
        updateData,
      );
    } else if (user.role === Role.EMPLOYER) {
      if (!updatedUser?.employer) {
        throw new HttpException('Employer not found', 404);
      }
      await this.employerService.updateEmployer(
        updatedUser?.employer._id,
        updateData,
      );
    } else if (user.role === Role.AGENCY) {
      if (!updatedUser?.agency) {
        throw new HttpException('Agency not found', 404);
      }
      await this.agencyService.updateAgency(
        updatedUser?.agency._id,
        updateData,
      );
    } else if (user.role === Role.ADMIN) {
      if (!updatedUser?.admin) {
        throw new HttpException('Admin not found', 404);
      }
      await this.adminService.updateAdmin(updatedUser?.admin._id, updateData);
    }

    return {
      message: 'User updated successfully',
    };
  }

  async signatureUploaded(userId: Types.ObjectId) {
    await this.authModel.findByIdAndUpdate(userId, { signature: true });
  }

  async getUserProfileByUsername(username: string, requestingUser?: any) {
    // Find user by username
    console.log('username', username);
    const user = await this.authModel
      .findOne({ userName: username })
      .populate('worker')
      .populate('employer')
      .populate('agency')
      .populate('admin')
      .exec();
    console.log('user', user);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    console.log('requestingUser', requestingUser);
    // Determine if the requesting user can see private data
    const isOwner =
      requestingUser &&
      requestingUser.userId.toString() === user._id.toString();
    const isAdmin =
      requestingUser && ['admin', 'superadmin'].includes(requestingUser.role);
    console.log('isOwner', isOwner);
    console.log('isAdmin', isAdmin);
    // Get role-specific data
    let profileData: any = null;
    if (user.role === Role.WORKER) {
      profileData = user.worker;
    } else if (user.role === Role.EMPLOYER) {
      profileData = user.employer;
    } else if (user.role === Role.AGENCY) {
      profileData = user.agency;
    } else if (user.role === Role.ADMIN) {
      profileData = user.admin;
    }
    console.log('profileData', profileData);
    // Filter sensitive data based on permissions
    const filteredUser: any = {
      ...user.toObject(),
      ...profileData.toObject(),
    };
    return filteredUser;
  }
  async updateProfilePhoto(
    userId: Types.ObjectId,
    url: string,
    s3Key: string,
    role: string,
  ) {
    if (role === Role.WORKER) {
      // Find the worker document first to get its _id
      const user = await this.authModel.findById(userId);
      if (!user) {
        throw new HttpException('Worker not found', 404);
      }
      return await this.workerService.updateWorker(
        user.worker as Types.ObjectId,
        {
          profilePicture: { url, s3Key },
        },
      );
    } else if (role === Role.EMPLOYER) {
      // Find the employer document first to get its _id
      const employer = await this.employerService.getEmployerByUserId(
        userId.toString(),
      );
      if (!employer) {
        throw new HttpException('Employer not found', 404);
      }
      return await this.employerService.updateEmployer(
        employer._id as Types.ObjectId,
        {
          profilePicture: { url, s3Key },
        },
      );
    } else if (role === Role.AGENCY) {
      // Find the agency document first to get its _id
      const agency = await this.agencyService.getAgencyByUserId(userId);
      if (!agency) {
        throw new HttpException('Agency not found', 404);
      }
      return await this.agencyService.updateAgency(
        agency._id as Types.ObjectId,
        {
          profilePicture: { url, s3Key },
        },
      );
    }
  }
}
