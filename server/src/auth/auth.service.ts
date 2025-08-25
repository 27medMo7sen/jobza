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
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly workerService: WorkerService,
    private readonly employerService: EmployerService,
    private readonly agencyService: AgencyService,
  ) {}
  //MARK: signup
  async signup(body: WorkerSignupDto | EmployerSignupDto | AgencySignupDto) {
    console.log("auth service body", body);
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
      role: body.role,
    };
    console.log("auth service authData", authData);
    const newUser = new this.authModel(authData);
    console.log("auth service newUser", newUser);
    let displayName = '';
    await newUser.save();
    console.log("auth service newUser", newUser);
    if (body.role === 'worker') {
      const { email, password, confirmPassword, ...workerData } = body;
      displayName = (workerData as WorkerSignupDto).firstName;
      await this.workerService.createWorker({...workerData, userId: newUser._id});
    } else if (body.role === 'employer') {
      const { email, password, confirmPassword, ...employerData } = body;
      displayName = (employerData as EmployerSignupDto).firstName;
      await this.employerService.createEmployer({...employerData, userId: newUser._id});
    } else if (body.role === 'agency') {
      const { email, password, confirmPassword, ...agencyData } = body;
      displayName = (agencyData as AgencySignupDto).agencyName;
      await this.agencyService.createAgency({...agencyData, userId: newUser._id});
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
    const updatedUser = await this.authModel.findByIdAndUpdate(user._id, {
      token,
    });
    // console.log('User:', user);
    return { user: updatedUser };
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
        await this.workerService.createWorker({
          firstName: _json.given_name,
          userId: newUser._id,
        });
      } else if (role === 'employer') {
        await this.employerService.createEmployer({
          firstName: _json.given_name,
          userId: newUser._id,
        });
      } else if (role === 'agency') {
        await this.agencyService.createAgency({
          agencyName: _json.given_name,
          userId: newUser._id,
        });
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
}
