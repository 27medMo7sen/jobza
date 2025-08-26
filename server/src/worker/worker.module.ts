import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { WorkerSchema } from './worker.model';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { AuthSchema } from 'src/auth/auth.model';
import {
  Affiliation,
  AffiliationSchema,
} from 'src/affiliations/affiliation.model';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Worker', schema: WorkerSchema }]),
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
    MongooseModule.forFeature([
      { name: Affiliation.name, schema: AffiliationSchema },
    ]),
  ],
  controllers: [WorkerController],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
