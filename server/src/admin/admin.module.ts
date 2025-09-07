import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './admin.model';
import { AuthSchema } from 'src/auth/auth.model';
import { WorkerSchema } from 'src/worker/worker.model';
import { File, FileSchema } from 'src/files/files.model';
import { AuthModule } from 'src/auth/auth.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: 'Auth', schema: AuthSchema },
      { name: 'Worker', schema: WorkerSchema },
      { name: File.name, schema: FileSchema },
    ]),
    AuthModule,
    FilesModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
