import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LlmRepository } from '../../modules/llm/repository/llm.repository';
import { LLMSearchService } from '../../modules/llm/service/llm.service';
import { MoviesController } from './controllers/movie.controller';
import { MovieEntity } from './domains/schemas/movie.schema';
import { GenreEntity } from './domains/schemas/movie-genre.schema';
import { MoviePopularEntity } from './domains/schemas/movie-popular.schema';
import { MovieSimilarEntity } from './domains/schemas/movie-similar.schema';
import { MovieTrendingDayEntity } from './domains/schemas/movie-trending-day.schema';
import { MovieTrendingWeekEntity } from './domains/schemas/movie-trending-week.schema';
import { MoviesRepository } from './repository/movie.repository';
import { MovieGenresRepository } from './repository/movie-genres.repository';
import { MoviePopularRepository } from './repository/movie-popular.repository';
import { MovieSimilarRepository } from './repository/movie-similar.repository';
import { MovieTrendingDayRepository } from './repository/movie-trending-day.repository';
import { MovieTrendingWeekRepository } from './repository/movie-trending-week.repository';
import { MoviesService } from './services/movie.service';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([MovieEntity], 'mongodbConnection'),
    TypeOrmModule.forFeature([GenreEntity], 'mongodbConnection'),
    TypeOrmModule.forFeature([MovieTrendingDayEntity], 'mongodbConnection'),
    TypeOrmModule.forFeature([MovieTrendingWeekEntity], 'mongodbConnection'),
    TypeOrmModule.forFeature([MoviePopularEntity], 'mongodbConnection'),
    TypeOrmModule.forFeature([MovieSimilarEntity], 'mongodbConnection'),
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    MoviesRepository,
    MovieTrendingDayRepository,
    MovieTrendingWeekRepository,
    MovieGenresRepository,
    MoviePopularRepository,
    LlmRepository,
    MovieSimilarRepository,
    LLMSearchService,
  ],
  exports: [MoviesService],
})
export class MoviesModule {}
