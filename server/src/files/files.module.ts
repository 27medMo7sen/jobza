import { Module, forwardRef } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './files.model';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from 'src/auth/auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { WorkerModule } from 'src/worker/worker.module';
import { EmployerModule } from 'src/employer/employer.module';
import { AgencyModule } from 'src/agency/agency.module';
import { AuthSchema } from 'src/auth/auth.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
    AwsS3Module,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRATION') || '1h',
        },
      }),
    }),
    AuthModule,
    forwardRef(() => WorkerModule),
    forwardRef(() => EmployerModule),
    forwardRef(() => AgencyModule),
  ],
  controllers: [FilesController],
  providers: [FilesService, LocalAuthGuard],
  exports: [FilesService],
})
export class FilesModule {}
