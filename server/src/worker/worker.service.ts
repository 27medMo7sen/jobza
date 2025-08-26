import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Worker } from './worker.model';
import { Auth } from 'src/auth/auth.model';
import { Affiliation } from 'src/affiliations/affiliation.model';
@Injectable()
export class WorkerService {
  constructor(
    @InjectModel('Worker') private readonly workerModel: Model<Worker>,
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
    @InjectModel('Affiliation')
    private readonly affiliationModel: Model<Affiliation>,
  ) {}

  async createWorker(workerData: any): Promise<Worker> {
    console.log(workerData);
    const createdWorker = new this.workerModel(workerData);
    return createdWorker.save();
  }

  async createWorkerWithUserId(
    userId: string,
    workerData: any,
  ): Promise<Worker> {
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
  async getWorkerByUserId(userId: Types.ObjectId): Promise<Worker | null> {
    console.log('userId', userId);
    const worker = await this.workerModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .lean<Worker>()
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
  //   async updateWorker(workerData: any): Promise<Worker> {
  //     console.log('workerData', workerData);
  //     const userObjectId =
  //       typeof workerData.userId === 'string'
  //         ? new Types.ObjectId(workerData.userId)
  //         : workerData.userId;
  //     const worker = await this.workerModel
  //       .findOneAndUpdate(
  //         { userId: userObjectId },
  //         { $set: { isAffiliated: workerData.isAffiliated } },
  //         { new: true },
  //       )
  //       .lean<Worker>()
  //       .exec();
  //     console.log('worker', worker);
  //     if (!worker) {
  //       throw new BadRequestException('Worker not found');
  //     }
  //     return worker;
  //   }
  // }
}
