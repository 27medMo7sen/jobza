import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Request,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { AffiliationService } from './affiliation.service';
import { WorkerService } from 'src/worker/worker.service';
import { AgencyService } from 'src/agency/agency.service';
import { LocalAuthGuard } from 'src/auth/auth.guard';
import { MailService } from 'src/mail/mail.service';
import { Roles } from 'src/auth/roles.decorator';
import { Affiliation } from './affiliation.model';

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
  @UseGuards(LocalAuthGuard)
  @Roles('agency')
  async getAvailable() {
    return this.workerService.getAvailableWorkers();
  }

  // Get received requests (JWT يحدد الـ receiver)
  //MARK: getReceived
  @Get('requests/received')
  @UseGuards(LocalAuthGuard)
  @Roles('worker', 'agency')
  async getReceived(@Request() req) {
    const { userId } = req.user;
    return this.affiliationService.getReceived(userId);
  }

  // Get sent requests (JWT يحدد الـ sender)
  //MARK: getSent
  @Get('requests/sent')
  @UseGuards(LocalAuthGuard)
  @Roles('worker', 'agency')
  async getSent(@Request() req) {
    return this.affiliationService.getSent(req.userId);
  }

  // Respond to affiliation requests
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

  // Delete affiliation request
  //MARK: deleteRequest
  @Delete('requests/:id')
  async deleteRequest(@Param('id') id: string) {
    return this.affiliationService.deleteRequest(id);
  }

  // Update affiliation request
  //MARK: updateRequest
  @Patch('requests/:id')
  async updateRequest(
    @Param('id') id: string,
    @Body() body: Partial<Affiliation>,
  ) {
    return this.affiliationService.editAffiliation(id, body);
  }

  // Get affiliation history
  //MARK: getHistory
  @Get('history')
  @UseGuards(LocalAuthGuard)
  @Roles('worker', 'agency')
  async getHistory(@Request() req) {
    const { userId } = req.user;
    return this.affiliationService.getHistory(userId);
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

  // @Get('pending-affiliations')
  // @UseGuards(LocalAuthGuard)
  // @Roles('worker', 'agency')
  // async getPendingAffiliations(@Request() req) {
  //   const { userId } = req.user;
  //   return this.affiliationService.getPendingAffiliations(userId);
  // }
}
