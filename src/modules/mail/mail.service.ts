import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import { handleError } from '../../common/utils';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationCode(email: string, code: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Email Verification Code',
        template: 'verification',
        context: {
          code,
          appName: this.configService.get<string>('APP_NAME'),
        },
      });
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async sendResetPasswordLink(email: string, resetLink: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Password Code',
        template: 'reset-password',
        context: {
          resetLink,
          appName: this.configService.get<string>('APP_NAME'),
        },
      });
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async sendPasswordChangedNotification(email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Changed Successfully',
      template: 'password-changed',
    });
  }
}
