import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Affiliation } from './affiliation.model';
import { WorkerService } from 'src/worker/worker.service';
import { Worker } from 'src/worker/worker.model';
import { MailService } from 'src/mail/mail.service';
import { AgencyService } from 'src/agency/agency.service';
import { Auth } from 'src/auth/auth.model';
@Injectable()
export class AffiliationService {
  constructor(
    @InjectModel('Affiliation')
    private readonly affiliationModel: Model<Affiliation>,
    @InjectModel('Auth')
    private readonly authModel: Model<Auth>,
    // @InjectModel('Worker') private readonly workerModel: Model<Worker>,
    private readonly workerService: WorkerService,
    private readonly mailService: MailService,
    private readonly agencyService: AgencyService,
  ) {}

  async createAffiliation(receiverId: string, details: string | '', user: any) {
    const { role, userId } = user;
    // console.log(role, userId);
    const senderRole = role;
    const senderId = userId;
    const receiverRole = role === 'worker' ? 'agency' : 'worker';
    const receiver = await this.authModel.findById(receiverId).select('email');
    if (!receiver) return false;
    const existingAffiliation = await this.affiliationModel.findOne({
      senderRole,
      senderId: senderId,
      receiverRole: receiverRole,
      receiverId: receiverId,
      status: { $in: ['pending', 'accepted'] },
    });
    if (existingAffiliation) {
      throw new BadRequestException('Affiliation already exists');
    }
    const affiliation = new this.affiliationModel({
      senderRole,
      senderId: senderId,
      receiverRole: role === 'worker' ? 'agency' : 'worker',
      receiverId: receiverId,
      details,
    });
    let name = '';
    console.log("i'm here");

    if (role === 'agency') {
      const worker = await this.workerService.getWorkerByUserId(receiver._id);
      name = worker?.userName ?? '';
    } else {
      const agency = await this.agencyService.getAgencyByUserId(receiver._id);
      name = agency?.agencyName ?? '';
    }

    const sendEmail = await this.mailService.sendAffiliationRequestEmail(
      receiver.email,
      name,
      details,
      senderRole,
      senderId,
    );

    console.log('sendEmail', sendEmail);
    if (!sendEmail) {
      this.affiliationModel.findByIdAndDelete(affiliation._id);
      throw new BadRequestException('email not sent');
    }
    return await affiliation.save();
  }

  async getReceived(receiverRole: string, receiverId: string) {
    const affiliationsReceived = await this.affiliationModel.find({
      receiverRole,
      receiverId: new Types.ObjectId(receiverId),
    });
    console.log('affiliationsReceived', affiliationsReceived);
    return affiliationsReceived;
  }

  async getSent(senderRole: string, senderId: string) {
    const affiliationsSent = await this.affiliationModel.find({
      senderRole,
      senderId: new Types.ObjectId(senderId),
    });
    console.log('affiliationsSent', affiliationsSent);
    return affiliationsSent;
  }

  async getPendingAffiliations(userId: string): Promise<Affiliation[]> {
    return this.affiliationModel.find({
      receiverId: userId,
      status: 'pending',
    });
  }

  async updateStatus(
    affiliationId: string,
    status: 'accepted' | 'rejected',
    userId: string,
  ) {
    // check if the affiliation is pending
    const affiliation = await this.affiliationModel.findByIdAndUpdate(
      affiliationId,
      { status },
      { new: true },
    );
    await this.workerService.setAffiliatedStatus(userId, status === 'accepted');

    return affiliation;
  }
  // async updateStatus(id: string, status: 'accepted' | 'rejected') {
  //   // check if the affiliation is pending
  //   const affiliation = await this.affiliationModel
  //     .findById(id)
  //     .lean<Affiliation>()
  //     .exec();
  //   if (!affiliation) {
  //     throw new BadRequestException('Affiliation not found');
  //   }
  //   if (affiliation.status !== 'pending') {
  //     throw new BadRequestException('Affiliation is not pending');
  //   }
  //   // update the isaffiliated status of worker based on the affiliation status
  //   const affiliationStatus = await this.affiliationModel.findByIdAndUpdate(
  //     id,
  //     { status },
  //     { new: true },
  //   );
  //   console.log('affiliationStatus', affiliationStatus);
  //   if (status === 'accepted') {
  //     if (affiliation.senderRole === 'worker') {
  //       console.log('worker check');
  //       console.log('affiliation.senderId', affiliation.senderId);
  //       const workerAffiliateStatus = await this.workerService.updateWorker({
  //         userId: affiliation.senderId,
  //         isAffiliated: true,
  //       });
  //       console.log('workerAffiliateStatus', workerAffiliateStatus);
  //     } else {
  //       console.log('affiliation.receiverId', affiliation.receiverId);
  //       const workerAffiliateStatus = await this.workerService.updateWorker({
  //         userId: affiliation.receiverId,
  //         isAffiliated: true,
  //       });
  //       console.log('workerAffiliateStatus', workerAffiliateStatus);
  //     }
  //   }
  //   return affiliationStatus;
  // }

  async emailSent(id: string) {
    console.log('affiliation service emailSent', id);
    return await this.affiliationModel.findByIdAndUpdate(
      id,
      { email_sent: true },
      { new: true },
    );
  }
}
