import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URI'),
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
    console.log(configService.get<string>('GOOGLE_CLIENT_ID'));
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      // "state" survives the Google redirect
      const role = req.query.state;
      console.log('Role from state:', role);
      console.log('Profile from Google:', profile);
      const user = await this.authService.validateOAuthUser(profile, role);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
