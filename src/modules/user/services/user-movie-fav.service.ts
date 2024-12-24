import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { PageMetaDto } from '../../../common/page-meta.dto';
import { PageOptionsDto } from '../../../common/page-options.dto';
import { handleError } from '../../../common/utils';
import { MovieEntity } from '../../movie/domains/schemas/movie.schema';
import { MoviesService } from '../../movie/services/movie.service';
import { SuccessResponse } from '../domains/dtos/responses/success-response.dto';
import { UserFavMoviesRepository } from '../repository/user-movie-fav.repository';

export interface IUserFavMoviesService {
  addFavorite(userId: string, tmdbId: string): Promise<SuccessResponse>;
  removeFavorite(userId: string, tmdbId: string): Promise<SuccessResponse>;
  getFavoriteList(
    userId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<{
    items: MovieEntity[];
    meta: PageMetaDto;
  }>;
}

@Injectable()
export class UserFavMoviesService implements IUserFavMoviesService {
  public logger: Logger;

  constructor(
    @Inject('IUserFavMoviesRepository')
    private readonly userFavMoviesRepository: UserFavMoviesRepository,
    private readonly moviesService: MoviesService,
  ) {
    this.logger = new Logger(UserFavMoviesService.name);
  }

  async addFavorite(userId: string, tmdbId: string) {
    try {
      const favoriteList =
        await this.userFavMoviesRepository.findOrCreateFavoriteList(userId);
      const movieExists = await this.userFavMoviesRepository.checkMovieExists(
        favoriteList.id,
        tmdbId,
      );

      if (movieExists) {
        throw new ConflictException(`Movie with id ${tmdbId} already exists`);
      }

      await this.userFavMoviesRepository.addMovieToList(
        favoriteList.id,
        tmdbId,
      );

      return new SuccessResponse('Movie added to favorite list');
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async removeFavorite(userId: string, tmdbId: string) {
    try {
      const favoriteList =
        await this.userFavMoviesRepository.findOrCreateFavoriteList(userId);
      const movieExists = await this.userFavMoviesRepository.checkMovieExists(
        favoriteList.id,
        tmdbId,
      );

      if (!movieExists) {
        throw new NotFoundException(
          `Movie with id ${tmdbId} not found in favorites`,
        );
      }

      await this.userFavMoviesRepository.removeMovieFromList(
        favoriteList.id,
        tmdbId,
      );

      return new SuccessResponse('Movie removed from favorite list');
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async getFavoriteList(userId: string, pageOptionsDto: PageOptionsDto) {
    const favoriteList =
      await this.userFavMoviesRepository.findOrCreateFavoriteList(userId);

    const movieIds = await this.userFavMoviesRepository.getMovieIdsFromList(
      favoriteList.id,
    );

    const movies = await this.moviesService.getMoviesByIds(
      movieIds,
      pageOptionsDto,
    );

    return movies;
  }
}
