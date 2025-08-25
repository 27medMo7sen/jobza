import { HttpException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string, name: string, code: string) {
    const ret = await this.mailerService.sendMail({
      to: to,
      subject: 'Verify Your Email',
      template: 'verification-code',
      context: {
        name: name,
        code: code,
        logoUrl:
          'https://res.cloudinary.com/doou4eolq/image/upload/v1754270131/logo_st60zo.png',
      },
    });
    if (!ret) {
      throw new HttpException('Failed to send welcome email', 500);
    }
    return {
      message: 'Welcome email sent successfully',
      to,
    };
  }
  async sendAffiliationRequestEmail(to: string, name: string, details: string = '', senderRole: string, senderId: string) {
    const ret = await this.mailerService.sendMail({
      to: to,
      subject: 'Affiliation Request',
      template: 'affiliation-request',
      context: {
        name: name,
        details: details,
        senderRole: senderRole,
        senderId: senderId,
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
}
