import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agency } from './agency.model';

@Injectable()
export class AgencyService {
  constructor(
    @InjectModel('Agency') private readonly agencyModel: Model<Agency>,
  ) {}
  async createAgency(agencyData: any): Promise<Agency> {
    const createdAgency = new this.agencyModel(agencyData);
    return createdAgency.save();
  }

  async createAgencyWithUserId(userId: string, agencyData: any): Promise<Agency> {
    const agencyWithUserId = { ...agencyData, userId };
    const createdAgency = new this.agencyModel(agencyWithUserId);
    return createdAgency.save();
  }

  async updateAgency(userId: string, updateData: any): Promise<Agency | null> {
    return this.agencyModel.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );
  }

  async deleteAgency(userId: string): Promise<boolean> {
    const result = await this.agencyModel.findOneAndDelete({ userId });
    return result !== null;
  }

  async getAgencyByUserId(userId: string): Promise<Agency | null> {
    return this.agencyModel.findOne({ userId });
  }
}
