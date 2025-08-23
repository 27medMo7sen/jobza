import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { WorkerSchema } from './worker.model';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Worker', schema: WorkerSchema }]),
  ],
  controllers: [WorkerController],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
