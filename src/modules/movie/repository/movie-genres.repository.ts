import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { GenreEntity } from '../domains/schemas/movie-genre.schema';

@Injectable()
export class MovieGenresRepository {
  constructor(
    @InjectRepository(GenreEntity, 'mongodbConnection')
    private readonly movieGenresRepository: MongoRepository<GenreEntity>,
  ) {}

  async getAll() {
    const items = await this.movieGenresRepository.find();

    return { items };
  }
}
