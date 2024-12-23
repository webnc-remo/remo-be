import { BadGatewayException, Injectable, Logger } from '@nestjs/common';

import { PageOptionsDto } from '../../../common/page-options.dto';
import { handleError } from '../../../common/utils';
import { MovieTrendingDayEntity } from '../domains/schemas/movie-trending-day.schema';
import { MoviesRepository } from '../repository/movie.repository';
import { MovieTrendingDayRepository } from '../repository/movie-trending-day.repository';
import { MovieTrendingWeekRepository } from '../repository/movie-trending-week.repository';

@Injectable()
export class MoviesService {
  public logger: Logger;

  constructor(
    private readonly moviesRepository: MoviesRepository,
    private readonly movieTrendingDayRepository: MovieTrendingDayRepository,
    private readonly movieTrendingWeekRepository: MovieTrendingWeekRepository,
  ) {
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

  async trending(type: string) {
    try {
      if (!type) {
        throw new BadGatewayException('Type is required');
      }

      if (type !== 'day' && type !== 'week') {
        throw new BadGatewayException('Type must be either "day" or "week"');
      }

      let trending: MovieTrendingDayEntity[] = [];

      if (type === 'day') {
        trending =
          await this.movieTrendingDayRepository.findMoviesTrendingDay();
      }

      if (type === 'week') {
        trending =
          await this.movieTrendingWeekRepository.findMoviesTrendingWeek();
      }

      return trending;
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }
}
