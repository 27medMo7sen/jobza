import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Worker } from './worker.model';
@Injectable()
export class WorkerService {
  constructor(
    @InjectModel('Worker') private readonly workerModel: Model<Worker>,
  ) {}

  async createWorker(workerData: any): Promise<Worker> {
    console.log(workerData);
    const createdWorker = new this.workerModel(workerData);
    return createdWorker.save();
  }

  async createWorkerWithUserId(userId: string, workerData: any): Promise<Worker> {
    const workerWithUserId = { ...workerData, userId };
    const createdWorker = new this.workerModel(workerWithUserId);
    return createdWorker.save();
  }

  async updateWorker(userId: string, updateData: any): Promise<Worker | null> {
    return this.workerModel.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );
  }

  async deleteWorker(userId: string): Promise<boolean> {
    const result = await this.workerModel.findOneAndDelete({ userId });
    return result !== null;
  }

  async getWorkerByUserId(userId: string): Promise<Worker | null> {
    return this.workerModel.findOne({ userId });
  }
}
