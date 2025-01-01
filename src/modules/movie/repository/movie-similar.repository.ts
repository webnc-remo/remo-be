import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { MovieSimilarEntity } from '../domains/schemas/movie-similar.schema';

@Injectable()
export class MovieSimilarRepository {
  constructor(
    @InjectRepository(MovieSimilarEntity, 'mongodbConnection')
    private readonly movieSimilarRepository: MongoRepository<MovieSimilarEntity>,
  ) {}

  async getByTmdbID(id: number) {
    const item = await this.movieSimilarRepository.findOne({
      where: {
        tmdb_id: id,
      },
    });

    return item?.similar_movies;
  }
}
