import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { PageOptionsDto } from '../../../common/page-options.dto';
import { handleError } from '../../../common/utils';
import { MoviesService } from '../../movie/services/movie.service';
import {
  ListInfoDto,
  ListMoviesResponseDto,
} from '../domains/dtos/responses/list-movies-response.dto';
import { SuccessResponse } from '../domains/dtos/responses/success-response.dto';
import { UserInfoDto } from '../domains/dtos/user-info.dto';
import { UserFavMoviesRepository } from '../repository/user-movie-fav.repository';

export interface IUserFavMoviesService {
  addFavorite(userId: string, tmdbId: string): Promise<SuccessResponse>;
  removeFavorite(userId: string, tmdbId: string): Promise<SuccessResponse>;
  getFavoriteList(
    userInfo: UserInfoDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<ListMoviesResponseDto>;
  checkFavorite(
    userId: string,
    tmdbId: string,
  ): Promise<{ isFavorite: boolean }>;
  getListMovies(
    listId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<ListMoviesResponseDto>;
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

  async getFavoriteList(
    userInfo: UserInfoDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<ListMoviesResponseDto> {
    const favoriteList =
      await this.userFavMoviesRepository.findOrCreateFavoriteList(userInfo.id);
    const movieIds = await this.userFavMoviesRepository.getMovieIdsFromList(
      favoriteList.id,
    );

    const movies = await this.moviesService.getMoviesByIds(
      movieIds,
      pageOptionsDto,
    );

    return {
      items: movies.items,
      list: {
        id: favoriteList.id,
        listName: favoriteList.listName,
        createdAt: favoriteList.createdAt,
        user: {
          fullname: userInfo.fullName as string,
          email: userInfo.email as string,
        },
      },
      meta: movies.meta,
    };
  }

  async checkFavorite(userId: string, tmdbId: string) {
    try {
      const favoriteList =
        await this.userFavMoviesRepository.findOrCreateFavoriteList(userId);
      const movieExists = await this.userFavMoviesRepository.checkMovieExists(
        favoriteList.id,
        tmdbId,
      );

      return { isFavorite: Boolean(movieExists) };
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async getListMovies(
    listId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<ListMoviesResponseDto> {
    try {
      const list = await this.userFavMoviesRepository.getListById(listId);
      const listInfo: ListInfoDto = {
        id: list?.id as string,
        listName: list?.listName as string,
        createdAt: list?.createdAt as Date,
        user: {
          fullname: list?.user.fullName as string,
          email: list?.user.email as string,
        },
      };

      if (!list) {
        throw new NotFoundException('List not found');
      }

      if (!list.isPublic) {
        throw new ForbiddenException('List is not public');
      }

      const moviesInList =
        await this.userFavMoviesRepository.getMoviesFromList(listId);

      const movieIds = moviesInList.map((movie) => movie.tmdb_id);

      const movies = await this.moviesService.getMoviesByIds(
        movieIds,
        pageOptionsDto,
      );

      return {
        items: movies.items,
        list: listInfo,
        meta: movies.meta,
      };
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }
}
