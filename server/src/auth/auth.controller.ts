import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  HttpException,
  Query,
  Param,
} from '@nestjs/common';
import * as passport from 'passport';

import { AuthService } from './auth.service';
import { ValidationPipe } from '../pips/validation.pipe';
import { WorkerSignupDto } from './dto/workerSignup.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { EmployerSignupDto } from './dto/EmployerSignup.dto';
import { AgencySignupDto } from './dto/agencySignup.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('worker/signup')
  async signup(@Body(ValidationPipe) body: WorkerSignupDto) {
    return await this.authService.signup(body);
  }

  @Post('employer/signup')
  async signupEmployer(@Body(ValidationPipe) body: EmployerSignupDto) {
    return await this.authService.signup(body);
  }

  @Post('agency/signup')
  async agencySignup(@Body(ValidationPipe) body: AgencySignupDto) {
    console.log("auth controller body", body);
    return await this.authService.signup(body);
  }
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Body(ValidationPipe) body: LoginDto, @Req() req: any) {
    return await this.authService.login(body, req.user);
  }

  @Get('google')
  async googleAuth(@Req() req, @Res() res, @Query('role') role: string) {
    passport.authenticate('google', {
      scope: ['email', 'profile'],
      state: role,
    })(req, res);
  }
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;
    if (!user) {
      return res.redirect(`${process.env.CLIENT_ROOT}/login`);
    }
    return res.redirect(
      `${process.env.CLIENT_ROOT}/auth?mode=google&token=${user.token}`,
    );
  }

  @Post('/verify')
  async verifyEmail(@Body() body) {
    return await this.authService.verifyEmail(body.email, body.code);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() body) {
    return await this.authService.refreshToken(body.token);
  }

  @Get('/user-by-token')
  async getUserByToken(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new HttpException('Token not provided', 400);
    }
    return await this.authService.getUserByToken(token);
  }
}
