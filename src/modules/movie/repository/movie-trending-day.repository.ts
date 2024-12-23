import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { MovieTrendingDayEntity } from '../domains/schemas/movie-trending-day.schema';

@Injectable()
export class MovieTrendingDayRepository {
  constructor(
    @InjectRepository(MovieTrendingDayEntity, 'mongodbConnection')
    private readonly movieTrendingDayRepository: MongoRepository<MovieTrendingDayEntity>,
  ) {}

  async findMoviesTrendingDay() {
    const size = 12;

    return this.movieTrendingDayRepository.find({
      take: size,
      select: [
        'tmdb_id',
        'title',
        'original_title',
        'poster_path',
        'release_date',
        'vote_average',
        'vote_count',
        'overview',
        'popularity',
        'adult',
        'backdrop_path',
        'original_language',
        'video',
        'tagline',
        'genres',
      ],
    });
  }
}
