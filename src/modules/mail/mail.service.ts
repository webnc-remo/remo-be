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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          appName: this.configService.get('APP_NAME'),
        },
      });
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }
}
