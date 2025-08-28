import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mail.module';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { WorkerModule } from './worker/worker.module';
import { EmployerModule } from './employer/employer.module';
import { AgencyModule } from './agency/agency.module';
import { FilesModule } from './files/files.module';
import { AwsS3Service } from './aws-s3/aws-s3.service';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { AffiliationModule } from './affiliations/affiliation.module';
import { ContractModule } from './contract/contract.module';
import { ConnectionModule } from './connection/connection.module';
import { JobOfferModule } from './job-offer/job-offer.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: configService.get<boolean>('MAIL_SECURE'),
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"Jobza" <' + configService.get<string>('MAIL_USER') + '>',
        },
        template: {
          dir: __dirname + '/mail/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    MailModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    MailModule,
    WorkerModule,
    EmployerModule,
    AgencyModule,
    FilesModule,
    AwsS3Module,
    AffiliationModule,
    ContractModule,
    JobOfferModule,
    ApplicationModule,
    // ConnectionModule,
  ],
  controllers: [AppController],
  providers: [AppService, AwsS3Service],
})
export class AppModule {}
