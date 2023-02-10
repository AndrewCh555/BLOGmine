import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly clientUrl: string;
  private mailFrom: string;
  private mailEmail: string;

  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.clientUrl = this.configService.get('FE_APP_URL');
    this.mailFrom = this.configService.get('MAILER_FROM');
    this.mailEmail = this.configService.get('MAILER_EMAIL');
  }

  async sendUserResetPassword(user, pinCode) {
    await this.mailerService.sendMail({
      to: user.email,
      from: '${this.mailFrom}',
      subject: 'Reset Your BLOG Account Password!',
      html: `   <h3>Hello ${user.username}!</h3>
                 <p>Please use this PIN code ${pinCode} to reset your password.</p>`,
    });
  }
}
