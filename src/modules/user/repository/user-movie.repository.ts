import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserMovieListEntity } from '../domains/entities/user-movie-list.entity';
import { UserMovieListItemEntity } from '../domains/entities/user-movie-list-item.entity';

export interface IUserFavMoviesRepository {
  findOrCreateFavoriteList(userId: string): Promise<UserMovieListEntity>;
  checkMovieExists(listId: string, tmdbId: string);
  addMovieToList(listId: string, tmdbId: string);
  removeMovieFromList(listId: string, tmdbId: string);
  getMovieIdsFromList(listId: string): Promise<string[]>;
  getListById(listId: string): Promise<UserMovieListEntity | null>;
  getMoviesFromList(listId: string): Promise<UserMovieListItemEntity[]>;
}

@Injectable()
export class UserFavMoviesRepository implements IUserFavMoviesRepository {
  constructor(
    @InjectRepository(UserMovieListEntity, 'postgresConnection')
    private readonly userMovieListRepository: Repository<UserMovieListEntity>,
    @InjectRepository(UserMovieListItemEntity, 'postgresConnection')
    private readonly userMovieListItemRepository: Repository<UserMovieListItemEntity>,
  ) {}

  async findOrCreateFavoriteList(userId: string): Promise<UserMovieListEntity> {
    const userFavList = await this.userMovieListRepository.findOne({
      where: { user: { id: userId }, listType: 'favorite' },
    });

    if (!userFavList) {
      return this.userMovieListRepository.save({
        listName: 'Favorite',
        listType: 'favorite',
        user: { id: userId },
        createdAt: new Date(),
      });
    }

    return userFavList;
  }

  async checkMovieExists(listId: string, tmdbId: string) {
    return this.userMovieListItemRepository.findOne({
      where: { list: { id: listId }, tmdb_id: tmdbId },
    });
  }

  async addMovieToList(listId: string, tmdbId: string) {
    await this.userMovieListItemRepository.save({
      list: { id: listId },
      tmdb_id: tmdbId,
      createdAt: new Date(),
    });
  }

  async removeMovieFromList(listId: string, tmdbId: string) {
    await this.userMovieListItemRepository.delete({
      list: { id: listId },
      tmdb_id: tmdbId,
    });
  }

  async getMovieIdsFromList(listId: string): Promise<string[]> {
    const movieIds = await this.userMovieListItemRepository.find({
      where: { list: { id: listId } },
      select: ['tmdb_id'],
    });

    return movieIds.map((item) => item.tmdb_id);
  }

  async getListById(listId: string): Promise<UserMovieListEntity | null> {
    return this.userMovieListRepository.findOne({
      where: { id: listId },
    });
  }

  async getMoviesFromList(listId: string): Promise<UserMovieListItemEntity[]> {
    return this.userMovieListItemRepository.find({
      where: { list: { id: listId } },
      select: ['id', 'tmdb_id'],
    });
  }
}
