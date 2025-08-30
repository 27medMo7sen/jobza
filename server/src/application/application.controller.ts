import {
  Body,
  Get,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Application } from './application.model';
import { Roles } from 'src/auth/roles.decorator';
import { LocalAuthGuard } from 'src/auth/auth.guard';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Roles('agency', 'worker')
  @UseGuards(LocalAuthGuard)
  @Post('apply/:jobOfferId')
  async applyForJob(
    @Req() req: any,
    @Param('jobOfferId') jobOfferId: string,
  ): Promise<Application> {
    return this.applicationService.applyForJob(req.user.userId, jobOfferId);
  }
  @Roles('employer')
  @UseGuards(LocalAuthGuard)
  @Get('offer/:offerId')
  async getApplicationsByOffer(
    @Param('offerId') offerId: string,
  ): Promise<Application[]> {
    return this.applicationService.getApplicationsByOffer(offerId);
  }

  @Roles('employer')
  @UseGuards(LocalAuthGuard)
  @Get('all-applications')
  async getAllApplications(@Req() req: any): Promise<Application[]> {
    return this.applicationService.getAllApplications(req.user);
  }
}
