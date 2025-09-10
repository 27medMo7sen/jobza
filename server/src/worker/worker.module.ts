import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { WorkerSchema } from './worker.model';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { AuthSchema } from 'src/auth/auth.model';
import {
  Affiliation,
  AffiliationSchema,
} from 'src/affiliations/affiliation.model';
import { FileSchema } from 'src/files/files.model';
import { WorkerProfileStatusService } from './worker-profile-status.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Worker', schema: WorkerSchema }]),
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
    MongooseModule.forFeature([{ name: 'File', schema: FileSchema }]),
    MongooseModule.forFeature([
      { name: Affiliation.name, schema: AffiliationSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRATION') || '1h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [WorkerController],
  providers: [WorkerService, WorkerProfileStatusService],
  exports: [WorkerService, WorkerProfileStatusService],
})
export class WorkerModule {}
