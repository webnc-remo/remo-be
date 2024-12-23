import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MoviesController } from './controllers/movie.controller';
import { MovieEntity } from './domains/schemas/movie.schema';
import { GenreEntity } from './domains/schemas/movie-genre.schema';
import { MoviesRepository } from './repository/movie.repository';
import { MoviesService } from './services/movie.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieEntity], 'mongodbConnection'),
    TypeOrmModule.forFeature([GenreEntity], 'mongodbConnection'),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesRepository],
  exports: [MoviesService],
})
export class MoviesModule {}
