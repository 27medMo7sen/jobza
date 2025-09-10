import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employer } from './employer.model';
import { Types } from 'mongoose';
import { EmployerProfileStatusService } from './employer-profile-status.service';
@Injectable()
export class EmployerService {
  constructor(
    @InjectModel('Employer') private readonly employerModel: Model<Employer>,
    private readonly employerProfileStatusService: EmployerProfileStatusService,
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
    employerId: Types.ObjectId,
    updateData: any,
  ): Promise<Employer | null> {
    const employer = await this.employerModel.findOneAndUpdate(
      { _id: employerId },
      updateData,
      {
        new: true,
      },
    );

    // Trigger profile status update after employer data is updated
    if (employer && employer.userId) {
      await this.employerProfileStatusService.handleProfileUpdate(
        employer.userId,
      );
    }

    return employer;
  }

  async deleteEmployer(userId: string): Promise<boolean> {
    const result = await this.employerModel.findOneAndDelete({ userId });
    return result !== null;
  }

  async getEmployerByUserId(
    userId: string,
  ): Promise<(Employer & { _id: Types.ObjectId }) | null> {
    return this.employerModel
      .findOne({ userId })
      .lean<Employer & { _id: Types.ObjectId }>()
      .exec();
  }

  async getEmployerById(employerId: string): Promise<Employer | null> {
    return this.employerModel.findById(employerId).lean<Employer>().exec();
  }
}
