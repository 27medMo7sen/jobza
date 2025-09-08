import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employer } from './employer.model';
import { Types } from 'mongoose';
@Injectable()
export class EmployerService {
  constructor(
    @InjectModel('Employer') private readonly employerModel: Model<Employer>,
  ) {}
  async createEmployer(
    EmployerData: any,
  ): Promise<Employer & { _id: Types.ObjectId }> {
    const newEmployer = new this.employerModel(EmployerData);
    return newEmployer.save();
  }

  async createEmployerWithUserId(
    userId: string,
    employerData: any,
  ): Promise<Employer & { _id: Types.ObjectId }> {
    const employerWithUserId = { ...employerData, userId };
    const newEmployer = new this.employerModel(employerWithUserId);
    return newEmployer.save();
  }

  async updateEmployer(
    userId: Types.ObjectId,
    updateData: any,
  ): Promise<Employer | null> {
    return this.employerModel.findOneAndUpdate({ userId }, updateData, {
      new: true,
    });
  }

  async deleteEmployer(userId: string): Promise<boolean> {
    const result = await this.employerModel.findOneAndDelete({ userId });
    return result !== null;
  }

  async getEmployerByUserId(userId: string): Promise<Employer | null> {
    return this.employerModel.findOne({ userId });
  }

  async getEmployerById(employerId: string): Promise<Employer | null> {
    return this.employerModel.findById(employerId).lean<Employer>().exec();
  }
}
