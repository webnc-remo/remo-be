import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshTokenEntity } from '../auth/domains/entities/token.entity';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './domains/entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { UserService } from './services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity], 'postgresConnection'),
    TypeOrmModule.forFeature([RefreshTokenEntity], 'postgresConnection'),
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
  controllers: [UserController],
  exports: [UserService, 'IUserService'],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    UserService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
