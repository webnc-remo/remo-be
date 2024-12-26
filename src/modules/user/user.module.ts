import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshTokenEntity } from '../auth/domains/entities/token.entity';
import { MoviesModule } from '../movie/movie.module';
import { PlaylistController } from './controllers/playlist.controller';
import { RatingController } from './controllers/rating.controller';
import { UserController } from './controllers/user.controller';
import { UserFavMoviesController } from './controllers/user-movie-fav.controller';
import { UserMovieListController } from './controllers/user-movie-list.controller';
import { UserWatchlistController } from './controllers/user-movie-watchlist.controller';
import { RatingEntity } from './domains/entities/rating.entity';
import { UserEntity } from './domains/entities/user.entity';
import { UserMovieListEntity } from './domains/entities/user-movie-list.entity';
import { UserMovieListItemEntity } from './domains/entities/user-movie-list-item.entity';
import { PlaylistRepository } from './repository/playlist.repository';
import { RatingRepository } from './repository/rating.repository';
import { UserRepository } from './repository/user.repository';
import { UserFavMoviesRepository } from './repository/user-movie-fav.repository';
import { UserWatchlistRepository } from './repository/user-movie-watchlist.repository';
import { PlaylistService } from './services/playlist.service';
import { RatingService } from './services/rating.service';
import { UserService } from './services/user.service';
import { UserFavMoviesService } from './services/user-movie-fav.service';
import { UserWatchlistService } from './services/user-movie-watchlist.service';

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
    UserWatchlistController,
    PlaylistController,
    RatingController,
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
    UserFavMoviesRepository,
    {
      provide: 'IUserFavMoviesRepository',
      useClass: UserFavMoviesRepository,
    },
    {
      provide: 'IUserWatchlistRepository',
      useClass: UserWatchlistRepository,
    },
    UserWatchlistService,
    UserFavMoviesService,
    {
      provide: 'IUserFavMoviesService',
      useClass: UserFavMoviesService,
    },
    {
      provide: 'IUserWatchlistService',
      useClass: UserWatchlistService,
    },
    PlaylistService,
    PlaylistRepository,
    RatingService,
    RatingRepository,
  ],
})
export class UserModule {}
