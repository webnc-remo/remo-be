import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MovieEntity } from '../domains/schemas/movie.entity';

@Injectable()
export class MoviesRepository {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}

  async search(query: string): Promise<MovieEntity[]> {
    return this.movieRepository.find({
      where: {
        original_title: query,
      },
    });
  }
}
