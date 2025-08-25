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

  async getAvailableWorkers() {
    return this.workerModel.find({ isAffiliated: false });
  }
  async getWorkerById(id: string): Promise<Worker | null> {
    return this.workerModel.findById(id).lean<Worker>().exec();
  }
}
