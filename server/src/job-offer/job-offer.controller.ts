import { Controller, UseGuards, Post, Body, Req } from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { LocalAuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { JobOffer } from './job-offer.model';

@Controller('job-offer')
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {}
  @Post()
  @UseGuards(LocalAuthGuard)
  @Roles('agency', 'employer')
  async createJobOffer(
    @Body() jobOfferData: any,
    @Req() req,
  ): Promise<JobOffer> {
    const userId = req.user.userId;
    console.log('Creating job offer for user:', userId);
    return this.jobOfferService.createJobOffer({ ...jobOfferData, userId });
  }
}
