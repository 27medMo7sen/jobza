import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuperadminController } from './superadmin.controller';
import { SuperadminService } from './superadmin.service';
import { AdminSchema } from '../admin/admin.model';
import { AuthSchema } from '../auth/auth.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema },
      { name: 'Auth', schema: AuthSchema },
    ]),
    AuthModule,
  ],
  controllers: [SuperadminController],
  providers: [SuperadminService],
  exports: [SuperadminService],
})
export class SuperadminModule {}
