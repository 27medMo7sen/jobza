import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Worker } from './worker.model';
import { Auth } from 'src/auth/auth.model';
import { Affiliation } from 'src/affiliations/affiliation.model';
import { WorkerProfileStatusService } from './worker-profile-status.service';

@Injectable()
export class WorkerService {
  constructor(
    @InjectModel('Worker') private readonly workerModel: Model<Worker>,
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
    @InjectModel('Affiliation')
    private readonly affiliationModel: Model<Affiliation>,
    private readonly workerProfileStatusService: WorkerProfileStatusService,
  ) {}

  async createWorker(
    workerData: any,
  ): Promise<Worker & { _id: Types.ObjectId }> {
    console.log(workerData);
    console.log("i'm here");
    const createdWorker = new this.workerModel(workerData);
    console.log('createdWorker', createdWorker);
    return createdWorker.save();
  }

  async createWorkerWithUserId(userId: string, workerData: any): Promise<any> {
    const workerWithUserId = { ...workerData, userId };
    const createdWorker = new this.workerModel(workerWithUserId);
    return createdWorker.save();
  }

  async deleteWorker(userId: string): Promise<boolean> {
    const result = await this.workerModel.findOneAndDelete({ userId });
    return result !== null;
  }

  async getAvailableWorkers() {
    return this.workerModel.find({ isAffiliated: false });
  }
  async getWorkerByUserId(
    userId: Types.ObjectId,
  ): Promise<(Worker & { _id: Types.ObjectId }) | null> {
    console.log('userId', userId);
    const worker = await this.workerModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .lean<Worker & { _id: Types.ObjectId }>()
      .exec();
    console.log('worker', worker);
    return worker;
  }
  async getWorkerEmail(userId: string): Promise<string | null> {
    const worker = await this.authModel
      .findById(userId)
      .select('email')
      .lean<Auth>()
      .exec();
    console.log('worker service getWorkerEmail', worker);
    return worker?.email ?? null;
  }
  async setAffiliatedStatus(
    userId: string,
    isAffiliated: boolean,
  ): Promise<Worker | null> {
    const worker = await this.workerModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $set: { isAffiliated } },
        { new: true },
      )
      .lean<Worker>()
      .exec();
    console.log('worker', worker);
    return worker;
  }

  async updateWorker(
    workerId: Types.ObjectId,
    updateData: any,
  ): Promise<Worker | null> {
    console.log('workerId', workerId);
    console.log('updateData', updateData);
    const worker = (await this.workerModel
      .findOneAndUpdate({ _id: workerId }, { $set: updateData }, { new: true })
      .exec()) as Worker;
    console.log('worker', worker);

    // Trigger profile status update after worker data is updated
    if (worker && worker.userId) {
      await this.workerProfileStatusService.handleProfileUpdate(worker.userId);
    }

    return worker;
  }

  async getWorkerById(workerId: string): Promise<Worker | null> {
    console.log('workerId', workerId);
    return await this.workerModel
      .findOne({ userId: new Types.ObjectId(workerId) })
      .lean<Worker>()
      .exec();
  }
}
