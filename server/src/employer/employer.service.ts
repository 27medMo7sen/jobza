import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employer } from './employer.model';

@Injectable()
export class EmployerService {
  constructor(
    @InjectModel('Employer') private readonly employerModel: Model<Employer>,
  ) {}
  async createEmployer(EmployerData: any): Promise<Employer> {
    const newEmployer = new this.employerModel(EmployerData);
    return newEmployer.save();
  }
}
