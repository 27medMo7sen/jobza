import { Module } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AgencySchema } from './agency.model';
import { AuthSchema } from 'src/auth/auth.model';
import { FileSchema } from 'src/files/files.model';
import { AgencyProfileStatusService } from './agency-profile-status.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Agency', schema: AgencySchema }]),
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
    MongooseModule.forFeature([{ name: 'File', schema: FileSchema }]),
  ],
  controllers: [AgencyController],
  providers: [AgencyService, AgencyProfileStatusService],
  exports: [AgencyService, AgencyProfileStatusService],
})
export class AgencyModule {}
