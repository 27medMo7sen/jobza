import { Module } from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { JobOfferController } from './job-offer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobOffer, JobOfferSchema } from './job-offer.model';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { AgencyModule } from 'src/agency/agency.module';
import { WorkerModule } from 'src/worker/worker.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobOffer.name, schema: JobOfferSchema },
    ]),
    AuthModule,
    MailModule,
    AgencyModule,
    WorkerModule,
  ],
  controllers: [JobOfferController],
  providers: [JobOfferService],
  exports: [JobOfferService],
})
export class JobOfferModule {}
