import { BadGatewayException, Injectable, Logger } from '@nestjs/common';

import { PageOptionsDto } from '../../../common/page-options.dto';
import { handleError } from '../../../common/utils';
import { MovieTrendingDayEntity } from '../domains/schemas/movie-trending-day.schema';
import { MoviesRepository } from '../repository/movie.repository';
import { MovieGenresRepository } from '../repository/movie-genres.repository';
import { MovieTrendingDayRepository } from '../repository/movie-trending-day.repository';
import { MovieTrendingWeekRepository } from '../repository/movie-trending-week.repository';

@Injectable()
export class MoviesService {
  public logger: Logger;

  constructor(
    private readonly moviesRepository: MoviesRepository,
    private readonly movieTrendingDayRepository: MovieTrendingDayRepository,
    private readonly movieTrendingWeekRepository: MovieTrendingWeekRepository,
    private readonly movieGenresRepository: MovieGenresRepository,
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

  async getMovieById(id: number) {
    try {
      const movie = await this.moviesRepository.getMovieById(id);

      return movie;
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async getMoviesByIds(movieIds: string[], pageOptionsDto: PageOptionsDto) {
    const movies = await this.moviesRepository.findByIds(
      movieIds,
      pageOptionsDto,
    );

    return movies;
  }

  async getGenres() {
    try {
      const genres = await this.movieGenresRepository.getAll();

      return genres;
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async addMovieRating(movieId: number, rating: number) {
    try {
      const movie = await this.moviesRepository.getMovieById(movieId);

      if (movie.item) {
        const totalRating =
          movie.item.vote_average * movie.item.vote_count + rating;
        const voteCount = movie.item.vote_count + 1;
        const voteAverage = totalRating / voteCount;

        movie.item.vote_average = voteAverage;

        await this.moviesRepository.updateMovie(movie.item);
      }
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async updateMovieRating(
    movieId: number,
    ratingOld: number,
    ratingNew: number,
  ) {
    const movie = await this.moviesRepository.getMovieById(movieId);

    if (movie.item) {
      const totalRating =
        movie.item.vote_average * movie.item.vote_count - ratingOld + ratingNew;
      const voteCount = movie.item.vote_count;
      const voteAverage = totalRating / voteCount;

      movie.item.vote_average = voteAverage;
      await this.moviesRepository.updateMovie(movie.item);
    }
  }
}
