import { HttpException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Types } from 'mongoose';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    name: string,
    code: string,
    subject: string,
    template: string,
    logoUrl: string,
  ) {
    const ret = await this.mailerService.sendMail({
      to: to,
      subject: subject,
      template: template,
      context: {
        name: name,
        code: code,
        logoUrl: logoUrl,
      },
    });
    if (!ret) {
      throw new HttpException('Failed to send email', 500);
    }
    return {
      message: 'email sent successfully',
      to,
    };
  }
  async sendAffiliationRequestEmail(
    to: string,
    name: string,
    details: string = '',
    senderRole: string,
    senderId: string,
  ) {
    const ret = await this.mailerService.sendMail({
      to: to,
      subject: 'Affiliation Request',
      template: 'affiliation-request',
      context: {
        name: name,
        details: details,
        senderRole: senderRole,
        senderId: new Types.ObjectId(senderId),
        logoUrl:
          'https://res.cloudinary.com/doou4eolq/image/upload/v1754270131/logo_st60zo.png',
      },
    });
    if (!ret) {
      throw new HttpException('Failed to send affiliation request email', 500);
    }
    return {
      message: 'Affiliation request email sent successfully',
      to,
    };
  }
  async sendConnectionRequestEmail(
    to: string,
    name: string,

    senderRole: string,
  ) {
    const ret = await this.mailerService.sendMail({
      to: to,
      subject: 'Connection Request',
      template: 'connection-request',
      context: {
        name: name,
        senderRole: senderRole,
        // senderId: senderId ? new Types.ObjectId(senderId) : undefined,
        logoUrl:
          'https://res.cloudinary.com/doou4eolq/image/upload/v1754270131/logo_st60zo.png',
      },
    });
    if (!ret) {
      throw new HttpException('Failed to send connection request email', 500);
    }
    return {
      message: 'Connection request email sent successfully',
      to,
    };
  }
}
