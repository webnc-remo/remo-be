import { Injectable, Logger } from '@nestjs/common';

import { handleError } from '../../../common/utils';
import { MovieEntity } from '../domains/schemas/movie.entity';
import { MoviesRepository } from '../repository/movie.repository';

@Injectable()
export class MoviesService {
  public logger: Logger;

  constructor(private readonly moviesRepository: MoviesRepository) {
    this.logger = new Logger(MoviesService.name);
  }

  async search(query: string): Promise<MovieEntity[]> {
    try {
      const movies = await this.moviesRepository.search(query);

      return movies;
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }
}
