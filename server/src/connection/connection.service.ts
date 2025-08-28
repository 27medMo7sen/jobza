import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Connection } from './connection.model';
import { Model, Types } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { AuthService } from 'src/auth/auth.service';
import { WorkerService } from 'src/worker/worker.service';
import { EmployerService } from 'src/employer/employer.service';
import { AgencyService } from 'src/agency/agency.service';
@Injectable()
export class ConnectionService {
  constructor(
    @InjectModel('Connection') private connectionModel: Model<Connection>,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
    private readonly workerService: WorkerService,
    private readonly employerService: EmployerService,
    private readonly agencyService: AgencyService,
  ) {}

  async sendConnectionRequest(
    userId: string,
    role: string,
    targetUserId: string,
  ): Promise<void> {
    const user = await this.authService.getUserById(targetUserId);
    if (!user) throw new Error('User not found');
    let sender;
    console.log(role);
    if (role === 'worker') {
      console.log('userid:', userId);
      sender = await this.workerService.getWorkerById(userId);
    } else if (role === 'employer') {
      sender = await this.employerService.getEmployerById(userId);
    } else if (role === 'agency') {
      sender = await this.agencyService.getAgencyById(userId);
    }
    console.log('Sender:', sender);
    const connection = new this.connectionModel({
      senderId: new Types.ObjectId(userId),
      targetUserId: new Types.ObjectId(targetUserId),
      status: 'pending',
    });
    await connection.save();

    const sendEmail = await this.mailService.sendConnectionRequestEmail(
      user.email,
      sender.userName || sender.agencyName || 'User',
      role,
    );
    if (!sendEmail) {
      throw new Error('Failed to send connection request email');
    }
    return;
  }

  async respondToConnectionRequest(
    connectionId: Types.ObjectId,
    status: string,
  ): Promise<void> {
    console.log('Connection ID:', connectionId);
    const connection = await this.connectionModel.findById(connectionId);
    if (!connection) throw new Error('Connection not found');
    console.log('Connection:', connection);
    if (status === 'accepted') {
      connection.status = 'accepted';
      await connection.save();
    } else {
      await connection.deleteOne();
    }
    return;
  }
  async deleteConnectionRequest(connectionId: Types.ObjectId): Promise<void> {
    const connection = await this.connectionModel.findById(connectionId);
    if (!connection) throw new Error('Connection not found');
    await connection.deleteOne();
    return;
  }
}
