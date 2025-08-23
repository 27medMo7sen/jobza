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
}
