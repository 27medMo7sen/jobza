import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema } from './auth.model';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { WorkerModule } from 'src/worker/worker.module';
import { EmployerModule } from 'src/employer/employer.module';
import { AgencyService } from 'src/agency/agency.service';
import { AgencyModule } from 'src/agency/agency.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule, MailModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') || '1h' },
      }),
    }),
    PassportModule,
    WorkerModule,
    EmployerModule,
    AgencyModule,
    FilesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, GoogleStrategy, MailService],
  exports: [AuthService, JwtModule, MongooseModule],
})
export class AuthModule {}
