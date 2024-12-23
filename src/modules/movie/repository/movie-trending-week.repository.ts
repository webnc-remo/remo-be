import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { MovieTrendingWeekEntity } from '../domains/schemas/movie-trending-week.schema';

@Injectable()
export class MovieTrendingWeekRepository {
  constructor(
    @InjectRepository(MovieTrendingWeekEntity, 'mongodbConnection')
    private readonly movieTrendingWeekRepository: MongoRepository<MovieTrendingWeekEntity>,
  ) {}

  async findMoviesTrendingWeek() {
    const size = 12;

    return this.movieTrendingWeekRepository.find({
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
