import { Module, forwardRef } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './admin.model';
import { AuthSchema } from 'src/auth/auth.model';
import { File, FileSchema } from 'src/files/files.model';
import { AuthModule } from 'src/auth/auth.module';
import { WorkerModule } from 'src/worker/worker.module';
import { EmployerModule } from 'src/employer/employer.module';
import { AgencyModule } from 'src/agency/agency.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: 'Auth', schema: AuthSchema },
      { name: File.name, schema: FileSchema },
    ]),
    forwardRef(() => AuthModule),
    WorkerModule,
    EmployerModule,
    AgencyModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
