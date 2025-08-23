import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
}
