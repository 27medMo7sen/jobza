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
import { AuthGuard } from 'src/auth/auth.guard';
import { MailService } from 'src/mail/mail.service';
import { Affiliation } from './affiliation.model';

@Controller('affiliations')
@UseGuards(AuthGuard)
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
  async createAffiliation(
    @Request() req,
    @Body() body: { receiverId: string; details?: string },
  ) {
    const { role, userId, email } = req.user;
    console.log(role, userId, email);
    if (role !== 'worker' && role !== 'agency') {
      throw new BadRequestException('Invalid role');
    }
    let affiliation: any;
    let email_sent = false;

    if (role === 'agency') {
      // Agency → Worker
      const agency = await this.agencyService.getAgencyByUserId(userId);
      // check if this agency can affiliate by checking can affiliate
      if (!agency?.canAffiliate) {
        throw new BadRequestException('This agency cannot affiliate');
      }

      affiliation = await this.affiliationService.createAffiliation(
        'agency',
        userId,
        'worker',
        body.receiverId,
        body.details,
      );

      const worker = await this.workerService.getWorkerByUserId(
        body.receiverId,
      );
      const workerEmail = await this.workerService.getWorkerEmail(
        body.receiverId,
      );
      if (worker) {
        const { userName } = worker;
        const email_sent_worker =
          await this.mailService.sendAffiliationRequestEmail(
            workerEmail ?? '',
            `${userName}`.trim(),
            body.details ?? '',
            'agency',
            userId,
          );
        email_sent = true;
      }
    } else if (role === 'worker') {
      // Worker → Agency
      const worker = await this.workerService.getWorkerByUserId(userId);
      // check if this agency can affiliate by checking can affiliate
      if (worker?.isAffiliated) {
        throw new BadRequestException('You are already affiliated');
      }
      affiliation = await this.affiliationService.createAffiliation(
        'worker',
        userId,
        'agency',
        body.receiverId,
        body.details,
      );

      const agency = await this.agencyService.getAgencyByUserId(
        body.receiverId,
      );
      const agencyEmail = await this.agencyService.getAgencyEmail(
        body.receiverId,
      );
      if (agency) {
        const email_sent_agency =
          await this.mailService.sendAffiliationRequestEmail(
            agencyEmail ?? '',
            agency.agencyName,
            body.details ?? '',
            'worker',
            userId,
          );
        email_sent = true;
        console.log('email_sent_agency', email_sent_agency);
      }
    }

    if (affiliation && email_sent) {
      const emailSentUpdated = await this.affiliationService.emailSent(
        affiliation._id,
      );
      console.log('emailSentUpdated', emailSentUpdated);
    }

    return {
      success: true,
      message: email_sent
        ? 'Affiliation request sent'
        : 'Affiliation created but mail not sent',
      data: {
        affiliation,
        email_sent,
      },
    };
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

  // Accept / reject affiliation request
  //MARK: updateStatus
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'accepted' | 'rejected',
  ) {
    const affiliationStatus = await this.affiliationService.updateStatus(
      id,
      status,
    );
    return {
      success: true,
      message: 'Affiliation status updated',
      data: affiliationStatus,
    };
  }
}
