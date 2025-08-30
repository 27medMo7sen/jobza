import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Application } from './application.model';
import { Model } from 'mongoose';
import { Roles } from 'src/auth/roles.decorator';
import { LocalAuthGuard } from 'src/auth/auth.guard';
import { JobOfferService } from 'src/job-offer/job-offer.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<Application>,
    private readonly jobOfferService: JobOfferService,
  ) {}
  @Roles('agency', 'worker')
  @UseGuards(LocalAuthGuard)
  async applyForJob(userId: string, jobOfferId: string): Promise<Application> {
    const newApplication = new this.applicationModel({
      userId,
      jobOfferId,
    });
    return newApplication.save();
  }

  @Roles('employer')
  @UseGuards(LocalAuthGuard)
  async getApplicationsByOffer(offerId: string): Promise<Application[]> {
    const applications = await this.applicationModel
      .find({ offerId })
      .populate('user')
      .select('user status');
    return applications;
  }

  async getAllApplications(user: any): Promise<Application[]> {
    const offers = await this.jobOfferService.getAllJobOffers(user);
    return this.applicationModel.find({
      offerId: { $in: offers.map((offer) => offer._id) },
    });
  }
}
