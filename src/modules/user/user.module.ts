import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshTokenEntity } from '../auth/domains/entities/token.entity';
import { MoviesModule } from '../movie/movie.module';
import { UserController } from './controllers/user.controller';
import { UserFavMoviesController } from './controllers/user-movie-fav.controller';
import { UserMovieListController } from './controllers/user-movie-list.controller';
import { RatingEntity } from './domains/entities/rating.entity';
import { UserEntity } from './domains/entities/user.entity';
import { UserMovieListEntity } from './domains/entities/user-movie-list.entity';
import { UserMovieListItemEntity } from './domains/entities/user-movie-list-item.entity';
import { UserRepository } from './repository/user.repository';
import { UserFavMoviesRepository } from './repository/user-movie.repository';
import { UserService } from './services/user.service';
import { UserFavMoviesService } from './services/user-movie-fav.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity], 'postgresConnection'),
    TypeOrmModule.forFeature([RefreshTokenEntity], 'postgresConnection'),
    TypeOrmModule.forFeature([UserMovieListEntity], 'postgresConnection'),
    TypeOrmModule.forFeature([UserMovieListItemEntity], 'postgresConnection'),
    TypeOrmModule.forFeature([RatingEntity], 'postgresConnection'),
    MoviesModule,
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
  controllers: [
    UserController,
    UserFavMoviesController,
    UserMovieListController,
  ],
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
    {
      provide: 'IUserFavMoviesService',
      useClass: UserFavMoviesService,
    },
    UserFavMoviesService,
    UserFavMoviesRepository,
    {
      provide: 'IUserFavMoviesRepository',
      useClass: UserFavMoviesRepository,
    },
  ],
})
export class UserModule {}
