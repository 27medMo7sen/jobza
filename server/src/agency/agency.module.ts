import { Module } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AgencySchema } from './agency.model';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Agency', schema: AgencySchema }]),
  ],
  controllers: [AgencyController],
  providers: [AgencyService],
  exports: [AgencyService],
})
export class AgencyModule {}
