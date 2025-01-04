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
import { UserWatchlistRepository } from '../repository/user-movie-watchlist.repository';

export interface IUserWatchlistService {
  addWatchlist(userId: string, tmdbId: string): Promise<SuccessResponse>;
  removeWatchlist(userId: string, tmdbId: string): Promise<SuccessResponse>;
  getWatchlist(
    userInfo: UserInfoDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<ListMoviesResponseDto>;
  checkWatchlist(
    userId: string,
    tmdbId: string,
  ): Promise<{ isWatchlist: boolean }>;
  getListMovies(
    listId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<ListMoviesResponseDto>;
}

@Injectable()
export class UserWatchlistService implements IUserWatchlistService {
  public logger: Logger;

  constructor(
    @Inject('IUserWatchlistRepository')
    private readonly userWatchlistRepository: UserWatchlistRepository,
    private readonly moviesService: MoviesService,
  ) {
    this.logger = new Logger(UserWatchlistService.name);
  }

  async addWatchlist(userId: string, tmdbId: string) {
    try {
      const watchlist =
        await this.userWatchlistRepository.findOrCreateWatchlist(userId);
      const movieExists = await this.userWatchlistRepository.checkMovieExists(
        watchlist.id,
        tmdbId,
      );

      if (movieExists) {
        throw new ConflictException(`Movie with id ${tmdbId} already exists`);
      }

      await this.userWatchlistRepository.addMovieToList(watchlist.id, tmdbId);

      return new SuccessResponse('Movie added to favorite list');
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async removeWatchlist(userId: string, tmdbId: string) {
    try {
      const watchlist =
        await this.userWatchlistRepository.findOrCreateWatchlist(userId);
      const movieExists = await this.userWatchlistRepository.checkMovieExists(
        watchlist.id,
        tmdbId,
      );

      if (!movieExists) {
        throw new NotFoundException(
          `Movie with id ${tmdbId} not found in favorites`,
        );
      }

      await this.userWatchlistRepository.removeMovieFromList(
        watchlist.id,
        tmdbId,
      );

      return new SuccessResponse('Movie removed from favorite list');
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async getWatchlist(
    userInfo: UserInfoDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<ListMoviesResponseDto> {
    const watchlist = await this.userWatchlistRepository.findOrCreateWatchlist(
      userInfo.id,
    );
    const movieIds = await this.userWatchlistRepository.getMovieIdsFromList(
      watchlist.id,
    );

    const movies = await this.moviesService.getMoviesByIds(
      movieIds,
      pageOptionsDto,
    );

    return {
      items: movies.items,
      list: {
        id: watchlist.id,
        listName: watchlist.listName,
        createdAt: watchlist.createdAt,
        user: {
          fullname: userInfo.fullName as string,
        },
      },
      meta: movies.meta,
    };
  }

  async checkWatchlist(userId: string, tmdbId: string) {
    try {
      const watchlist =
        await this.userWatchlistRepository.findOrCreateWatchlist(userId);
      const movieExists = await this.userWatchlistRepository.checkMovieExists(
        watchlist.id,
        tmdbId,
      );

      return { isWatchlist: Boolean(movieExists) };
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async getListMovies(
    listId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<ListMoviesResponseDto> {
    try {
      const list = await this.userWatchlistRepository.getListById(listId);
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
        await this.userWatchlistRepository.getMoviesFromList(listId);

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
