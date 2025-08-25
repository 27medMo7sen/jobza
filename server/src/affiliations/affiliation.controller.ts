import { Controller, Post, Body, Get, Param, Patch, Query, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { AffiliationService } from './affiliation.service';
import { WorkerService } from 'src/worker/worker.service';
import { AgencyService } from 'src/agency/agency.service';
import { Worker } from 'src/worker/worker.model';
import { AuthGuard } from 'src/auth/auth.guard';
import { MailService } from 'src/mail/mail.service';

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
      let affiliation;
      let email_sent;

    if (role === 'agency') {
    // Agency → Worker
    // check if this agency can affiliate by checking can affiliate
    const agency = await this.agencyService.getAgencyById(userId);
    if (!agency?.canAffiliate) {
      throw new BadRequestException('This agency cannot affiliate');
    }
    console.log("agency", agency);
    affiliation = await this.affiliationService.createAffiliation(
        'agency',
        userId,
        'worker',
        body.receiverId,
        body.details,
    );
    } else if (role === 'worker') {
    // Worker → Agency
    affiliation = await this.affiliationService.createAffiliation(
        'worker',
        userId,
        'agency',
        body.receiverId,
        body.details,
    );
    }
    console.log("affiliation", affiliation);
    if (affiliation) {
        if (role === 'agency') {
          // receiver IS worker
          const worker = await this.workerService.getWorkerById(body.receiverId);
          console.log(worker);
          if (worker) {
            const { firstName = '', lastName = '' } = (worker ?? {}) as Partial<Worker>;
            email_sent = await this.mailService.sendAffiliationRequestEmail(
              email,
              `${firstName} ${lastName}`.trim(),
              body.details ?? '',
              'agency',
              userId,
            );
          }
        } else {
          // receiver IS agency
          const agency = await this.agencyService.getAgencyById(body.receiverId);
          if (agency) {
            email_sent = await this.mailService.sendAffiliationRequestEmail(
              email,
              agency.agencyName,
              body.details ?? '',
              'worker',
              userId,
            );
          }
        }
        // IF CREATIONS SUCCEFUL AND EMAIL SENT UPDATE EMAIL SENT TO TRUE
        if (email_sent) {
            return this.affiliationService.emailSent(affiliation._id);
      }
  
      return affiliation ?? email_sent;
    }
}

  // Get available entities depending on role
  //MARK: getAvailable
  @Get('available')
  async getAvailable(@Request() req) {
    const { role } = req.user;
    console.log("role to get affiliations", role);

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
    return this.affiliationService.getSent(role, userId);
  }

  // Accept / reject affiliation request
  //MARK: updateStatus
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: 'accepted' | 'rejected') {
    return this.affiliationService.updateStatus(id, status);
  }


  
}
