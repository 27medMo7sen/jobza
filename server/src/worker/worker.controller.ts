import { Controller, Inject, Post } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Worker } from './worker.model';

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}
}
