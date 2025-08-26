import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Put,
  Delete,
  Req,
  Res,
  HttpException,
  Query,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as passport from 'passport';

import { AuthService } from './auth.service';
import { ValidationPipe } from '../pips/validation.pipe';
import { WorkerSignupDto } from './dto/workerSignup.dto';
import { LocalAuthGuard } from './auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { EmployerSignupDto } from './dto/EmployerSignup.dto';
import { AgencySignupDto } from './dto/agencySignup.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from './roles.decorator';
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
    console.log('auth controller body', body);
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

  @Get('/user/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.authService.getUserByEmail(email);
  }

  @Post('/approve/:userId')
  @Roles('admin')
  @UseGuards(LocalAuthGuard)
  async approveUser(@Param('userId') userId: string) {
    return await this.authService.approveUser(userId);
  }

  // @Put('/update/:userId')
  // async updateUser(
  //   @Param('userId') userId: string,
  //   @Body(ValidationPipe) updateData: UpdateUserDto,
  // ) {
  //   return await this.authService.updateUser(userId, updateData);
  // }

  @Delete('/user/:userId')
  async deleteUser(@Param('userId') userId: string, @Req() req: any) {
    return await this.authService.deleteUser(userId, req.user);
  }

  //   @Put('/files/:userId')
  //   @UseInterceptors(FileInterceptor('file'))
  //   async replaceUserFile(
  //     @Param('userId') userId: string,
  //     @Body('label') label: string,
  //     @Body('type') type: 'picture' | 'documents',
  //     @UploadedFile() file: Express.Multer.File,
  //     @Body('issuanceDate') issuanceDate?: string,
  //     @Body('expirationDate') expirationDate?: string,
  //   ) {
  //     if (!file) throw new HttpException('File is required', 400);
  //     if (!label) throw new HttpException('label is required', 400);
  //     if (!type) throw new HttpException('type is required', 400);

  //     const parsedIssuance = issuanceDate ? new Date(issuanceDate) : undefined;
  //     const parsedExpiration = expirationDate ? new Date(expirationDate) : undefined;

  //     return this.authService.replaceUserFile(
  //       userId,
  //       label,
  //       type,
  //       file,
  //       parsedIssuance,
  //       parsedExpiration,
  //     );
  //   }
}
