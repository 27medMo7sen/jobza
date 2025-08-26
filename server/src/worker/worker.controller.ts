import { Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { LocalAuthGuard } from 'src/auth/auth.guard';

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}
}
