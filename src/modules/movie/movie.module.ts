import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MoviesController } from './controllers/movie.controller';
import { MovieEntity } from './domains/schemas/movie.schema';
import { GenreEntity } from './domains/schemas/movie-genre.schema';
import { MovieTrendingDayEntity } from './domains/schemas/movie-trending-day.schema';
import { MovieTrendingWeekEntity } from './domains/schemas/movie-trending-week.schema';
import { MoviesRepository } from './repository/movie.repository';
import { MovieTrendingDayRepository } from './repository/movie-trending-day.repository';
import { MovieTrendingWeekRepository } from './repository/movie-trending-week.repository';
import { MoviesService } from './services/movie.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieEntity], 'mongodbConnection'),
    TypeOrmModule.forFeature([GenreEntity], 'mongodbConnection'),
    TypeOrmModule.forFeature([MovieTrendingDayEntity], 'mongodbConnection'),
    TypeOrmModule.forFeature([MovieTrendingWeekEntity], 'mongodbConnection'),
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    MoviesRepository,
    MovieTrendingDayRepository,
    MovieTrendingWeekRepository,
  ],
  exports: [MoviesService],
})
export class MoviesModule {}
