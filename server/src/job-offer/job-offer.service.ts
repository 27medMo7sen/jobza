import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JobOffer } from './job-offer.model';
import { Model } from 'mongoose';
@Injectable()
export class JobOfferService {
  constructor(
    @InjectModel(JobOffer.name) private jobOfferModel: Model<JobOffer>,
  ) {}
  async createJobOffer(jobOfferData: any): Promise<JobOffer> {
    const createdJobOffer = new this.jobOfferModel(jobOfferData);
    return await createdJobOffer.save();
  }
}
