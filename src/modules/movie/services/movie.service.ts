import { Injectable, Logger } from '@nestjs/common';

import { PageOptionsDto } from '../../../common/page-options.dto';
import { handleError } from '../../../common/utils';
import { MoviesRepository } from '../repository/movie.repository';

@Injectable()
export class MoviesService {
  public logger: Logger;

  constructor(private readonly moviesRepository: MoviesRepository) {
    this.logger = new Logger(MoviesService.name);
  }

  async search(pageOptionsDto: PageOptionsDto) {
    try {
      const movies = await this.moviesRepository.search(pageOptionsDto);

      return movies;
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }
}
