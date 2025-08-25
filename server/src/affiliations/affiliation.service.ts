import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Affiliation } from './affiliation.model';

@Injectable()
export class AffiliationService {
  constructor(
    @InjectModel('Affiliation') private readonly affiliationModel: Model<Affiliation>,
  ) {}

  async createAffiliation(senderRole: string, senderId: string, receiverRole: string, receiverId: string, details?: string) {
    console.log("affiliation service createAffiliation", senderRole, senderId, receiverRole, receiverId, details);
    const affiliation =  new this.affiliationModel({
      senderRole,
      senderId,
      receiverRole,
      receiverId,
      details,
    });
    return await affiliation.save();
  }

  async getReceived(receiverRole: string, receiverId: string) {
    return this.affiliationModel.find({ receiverRole, receiverId });
  }

  async getSent(senderRole: string, senderId: string) {
    return this.affiliationModel.find({ senderRole, senderId });
  }

  async updateStatus(id: string, status: 'accepted' | 'rejected') {
    return this.affiliationModel.findByIdAndUpdate(id, { status }, { new: true });
  }
  async emailSent(id: string) {
    console.log("affiliation service emailSent", id);
    return await this.affiliationModel.findByIdAndUpdate(id, { email_sent: true }, { new: true });
  }
}
