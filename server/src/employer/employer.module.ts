import { Module } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { EmployerController } from './employer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployerSchema } from './employer.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Employer', schema: EmployerSchema }]),
  ],
  controllers: [EmployerController],
  providers: [EmployerService],
  exports: [EmployerService],
})
export class EmployerModule {}
