import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Agency } from './agency.model';
import { Auth } from 'src/auth/auth.model';
  
@Injectable()
export class AgencyService {
  constructor(
    @InjectModel('Agency') private readonly agencyModel: Model<Agency>,
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
  ) {}
  async createAgency(agencyData: any): Promise<Agency> {
    console.log("agency service agencyData", agencyData);
    const createdAgency = new this.agencyModel(agencyData);
    return createdAgency.save();
  }
  async getAvailableAgencies() {
    return this.agencyModel.find({ canAffiliate: true });
  }
  async getAgencyByUserId(userId: string) {
    return await this.agencyModel.findOne({userId : new Types.ObjectId(userId)}).lean();
  }
  async getAgencyEmail(userId: string) {
    const agency = await this.authModel.findById(userId).select('email').lean<Auth>().exec();
    console.log("agency service getAgencyEmail", agency);
      return agency?.email ?? null;
  }
}
