import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { RefreshTokenEntity } from './domains/entities/token.entity';
import { VerificationCodeEntity } from './domains/entities/verification-code.entity';
import { AuthRepository } from './repository/auth.repository';
import { VerificationCodeRepository } from './repository/verification-code.repository';
import { AuthService } from './services/auth.service';
import { GoogleOauthStrategy } from './services/strategies/google.strategy';
import { JwtStrategy } from './services/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [RefreshTokenEntity, VerificationCodeEntity],
      'postgresConnection',
    ),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRED'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    UserModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    VerificationCodeRepository,
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    JwtStrategy,
    GoogleOauthStrategy,
  ],
  exports: ['IAuthService', 'IAuthRepository'],
})
export class AuthModule {}
