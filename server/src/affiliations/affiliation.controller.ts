import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AffiliationService } from './affiliation.service';
import { WorkerService } from 'src/worker/worker.service';
import { AgencyService } from 'src/agency/agency.service';
import { Worker } from 'src/worker/worker.model';
import { LocalAuthGuard } from 'src/auth/auth.guard';
import { MailService } from 'src/mail/mail.service';
import { Affiliation } from './affiliation.model';
import { Roles } from 'src/auth/roles.decorator';
import { rootCertificates } from 'tls';

@Controller('affiliations')
@UseGuards(LocalAuthGuard)
export class AffiliationController {
  constructor(
    private readonly affiliationService: AffiliationService,
    private readonly workerService: WorkerService,
    private readonly agencyService: AgencyService,
    private readonly mailService: MailService,
  ) {}

  // Create affiliation (Agency -> Worker OR Worker -> Agency)
  //MARK: createAffiliation
  @Post()
  @UseGuards(LocalAuthGuard)
  @Roles('worker', 'agency')
  async createAffiliation(
    @Request() req,
    @Body() body: { receiverId: string; details?: string },
  ) {
    await this.affiliationService.createAffiliation(
      body.receiverId,
      body.details ?? '',
      req.user,
    );
  }

  // Get available entities depending on role
  //MARK: getAvailable
  @Get('available')
  async getAvailable(@Request() req) {
    const { role } = req.user;
    console.log('role to get affiliations', role);

    if (role === 'agency') {
      return this.workerService.getAvailableWorkers();
    } else if (role === 'worker') {
      return this.agencyService.getAvailableAgencies();
    }

    throw new Error('Invalid role');
  }

  // Get received requests (JWT يحدد الـ receiver)
  @Get('requests/received')
  async getReceived(@Request() req) {
    const { role, userId } = req.user;
    return this.affiliationService.getReceived(role, userId);
  }

  // Get sent requests (JWT يحدد الـ sender)
  @Get('requests/sent')
  async getSent(@Request() req) {
    const { role, userId } = req.user;
    console.log('role', role);
    console.log('userId', userId);
    return this.affiliationService.getSent(role, userId);
  }

  @Get('pending-affiliations')
  @UseGuards(LocalAuthGuard)
  @Roles('worker', 'agency')
  async getPendingAffiliations(@Request() req) {
    const { userId } = req.user;
    return this.affiliationService.getPendingAffiliations(userId);
  }

  @Post('affiliation-response')
  @UseGuards(LocalAuthGuard)
  @Roles('worker', 'agency')
  async affiliationResponse(
    @Request() req,
    @Body() body: { affiliationId: string; status: 'accepted' | 'rejected' },
  ) {
    const { userId } = req.user;
    return this.affiliationService.updateStatus(
      body.affiliationId,
      body.status,
      userId,
    );
  }

  // Accept / reject affiliation request
  //MARK: updateStatus
  // @Patch(':id/status')
  // async updateStatus(
  //   @Param('id') id: string,
  //   @Body('status') status: 'accepted' | 'rejected',
  // ) {
  //   const affiliationStatus = await this.affiliationService.updateStatus(
  //     id,
  //     status,
  //   );
  //   return {
  //     success: true,
  //     message: 'Affiliation status updated',
  //     data: affiliationStatus,
  //   };
  // }
}
