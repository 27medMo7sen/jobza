import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ConnectionController } from './connection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection, ConnectionSchema } from './connection.model';
import { MailModule } from 'src/mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';
import { WorkerModule } from 'src/worker/worker.module';
import { AgencyModule } from 'src/agency/agency.module';
import { EmployerModule } from 'src/employer/employer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Connection.name, schema: ConnectionSchema },
    ]),
    MailModule,
    AuthModule,
    WorkerModule,
    AgencyModule,
    EmployerModule,
  ],
  controllers: [ConnectionController],
  providers: [ConnectionService],
})
export class ConnectionModule {}
