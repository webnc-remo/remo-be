import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshTokenEntity } from '../auth/domains/entities/token.entity';
import { UserEntity } from '../user/domains/entities/user.entity';
import { UserRepository } from '../user/repository/user.repository';
import { UserService } from '../user/services/user.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRED'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  exports: [AuthService, 'IAuthService', UserService, 'IUserService'],
  providers: [
    AuthService,
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    UserService,
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class AuthModule {}
