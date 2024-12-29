// eslint-disable-next-line unicorn/import-style
import { join } from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (config: ConfigService) => ({
        transport: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          host: config.get('SMTP_HOST'),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          secure: config.get('SMTP_SECURE'),
          auth: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            user: config.get('SMTP_USER'),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            pass: config.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          from: `"${config.get('SMTP_FROM_NAME')}" <${config.get('SMTP_FROM_EMAIL')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
