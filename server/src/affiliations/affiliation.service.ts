import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Affiliation } from './affiliation.model';
import { WorkerService } from 'src/worker/worker.service';

@Injectable()
export class AffiliationService {
  constructor(
    @InjectModel('Affiliation') private readonly affiliationModel: Model<Affiliation>,
    private readonly workerService: WorkerService,
  ) {}

  async createAffiliation(senderRole: string, senderId: string, receiverRole: string, receiverId: string, details?: string) {
    console.log("affiliation service createAffiliation", senderRole, senderId, receiverRole, receiverId, details);

    const existingAffiliation = await this.affiliationModel.findOne({ senderRole, senderId : new Types.ObjectId(senderId), receiverRole, receiverId : new Types.ObjectId(receiverId), status: { $in: ['pending', 'accepted'] } });
    if (existingAffiliation) {
      throw new BadRequestException('Affiliation already exists');
    }
    const affiliation =  new this.affiliationModel({
      senderRole,
      senderId: new Types.ObjectId(senderId),
      receiverRole,
      receiverId: new Types.ObjectId(receiverId),
      details,
    });
    return await affiliation.save();
  }

  async getReceived(receiverRole: string, receiverId: string) {
    const affiliationsReceived = await this.affiliationModel.find({ receiverRole, receiverId : new Types.ObjectId(receiverId) });
    console.log("affiliationsReceived", affiliationsReceived);
    return affiliationsReceived;
  }

  async getSent(senderRole: string, senderId: string) {
    const affiliationsSent = await this.affiliationModel.find({ senderRole, senderId : new Types.ObjectId(senderId) });
    console.log("affiliationsSent", affiliationsSent);
    return affiliationsSent;
  }

  async updateStatus(id: string, status: 'accepted' | 'rejected') {
    // check if the affiliation is pending
    const affiliation = await this.affiliationModel.findById(id).lean<Affiliation>().exec();
    if (!affiliation) {
      throw new BadRequestException('Affiliation not found');
    }
    if (affiliation.status !== 'pending') {
      throw new BadRequestException('Affiliation is not pending');
    }
    // update the isaffiliated status of worker based on the affiliation status
    const affiliationStatus = await this.affiliationModel.findByIdAndUpdate(id, { status }, { new: true });
      console.log("affiliationStatus", affiliationStatus);
    if (status === 'accepted') {
      if (affiliation.senderRole === 'worker') {
        console.log('worker check')
        console.log("affiliation.senderId", affiliation.senderId);
        const workerAffiliateStatus = await this.workerService.updateWorker({userId: affiliation.senderId, isAffiliated: true });
        console.log("workerAffiliateStatus", workerAffiliateStatus);
      } else {
        console.log("affiliation.receiverId",affiliation.receiverId)
        const workerAffiliateStatus = await this.workerService.updateWorker({userId: affiliation.receiverId, isAffiliated: true });
        console.log("workerAffiliateStatus", workerAffiliateStatus);
      }
    }
    return affiliationStatus;
  }

  async emailSent(id: string) {
    console.log("affiliation service emailSent", id);
    return await this.affiliationModel.findByIdAndUpdate(id, { email_sent: true }, { new: true });
  }
}
