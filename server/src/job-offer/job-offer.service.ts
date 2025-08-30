import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JobOffer } from './job-offer.model';
import { Model, Types } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { WorkerService } from 'src/worker/worker.service';
import { AgencyService } from 'src/agency/agency.service';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class JobOfferService {
  constructor(
    @InjectModel(JobOffer.name) private jobOfferModel: Model<JobOffer>,
    private readonly mailService: MailService,
    private readonly workerService: WorkerService,
    private readonly agencyService: AgencyService,
    private readonly authService: AuthService,
  ) {}
  async createJobOffer(jobOfferData: any): Promise<JobOffer> {
    const createdJobOffer = new this.jobOfferModel(jobOfferData);
    if (jobOfferData.agencies && jobOfferData.agencies.length > 0) {
      jobOfferData.agencies.forEach(async (agencyId: string) => {
        const agency = await this.agencyService.getAgencyById(agencyId);
        console.log(agency);
        const sendEmail = await this.mailService.sendEmail(
          agency.userId.email,
          agency.agencyName,
          '',
          'New Job Offer Available',
          'job-offer',
          '',
        );
      });
    }
    return createdJobOffer.save();
  }

  async getAllJobOffers(
    user: any,
  ): Promise<(JobOffer & { _id: Types.ObjectId })[]> {
    return this.jobOfferModel.find({ employerId: user.userId });
  }
}
