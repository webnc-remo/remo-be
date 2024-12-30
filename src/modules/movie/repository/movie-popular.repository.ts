import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { MoviePopularEntity } from '../domains/schemas/movie-popular.schema';

@Injectable()
export class MoviePopularRepository {
  constructor(
    @InjectRepository(MoviePopularEntity, 'mongodbConnection')
    private readonly moviePopularRepository: MongoRepository<MoviePopularEntity>,
  ) {}

  async findMoviesPopular(): Promise<MoviePopularEntity[]> {
    const size = 12;

    return this.moviePopularRepository.find({
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
