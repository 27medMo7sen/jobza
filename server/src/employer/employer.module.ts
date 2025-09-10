import { Module } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { EmployerController } from './employer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployerSchema } from './employer.model';
import { AuthSchema } from 'src/auth/auth.model';
import { FileSchema } from 'src/files/files.model';
import { EmployerProfileStatusService } from './employer-profile-status.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Employer', schema: EmployerSchema }]),
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
    MongooseModule.forFeature([{ name: 'File', schema: FileSchema }]),
  ],
  controllers: [EmployerController],
  providers: [EmployerService, EmployerProfileStatusService],
  exports: [EmployerService, EmployerProfileStatusService],
})
export class EmployerModule {}
