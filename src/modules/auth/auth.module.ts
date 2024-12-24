import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshTokenEntity } from '../auth/domains/entities/token.entity';
import { RatingEntity } from '../user/domains/entities/rating.entity';
import { UserEntity } from '../user/domains/entities/user.entity';
import { UserMovieListEntity } from '../user/domains/entities/user-movie-list.entity';
import { UserMovieListItemEntity } from '../user/domains/entities/user-movie-list-item.entity';
import { UserRepository } from '../user/repository/user.repository';
import { UserService } from '../user/services/user.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { AuthService } from './services/auth.service';
import { GoogleOauthStrategy } from './services/strategies/google.strategy';
import { JwtStrategy } from './services/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity], 'postgresConnection'),
    TypeOrmModule.forFeature([UserEntity], 'postgresConnection'),
    TypeOrmModule.forFeature([UserMovieListEntity], 'postgresConnection'),
    TypeOrmModule.forFeature([UserMovieListItemEntity], 'postgresConnection'),
    TypeOrmModule.forFeature([RatingEntity], 'postgresConnection'),
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
    JwtStrategy,
    GoogleOauthStrategy,
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
