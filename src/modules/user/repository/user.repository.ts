import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GoogleAccount } from '../../auth/domains/dtos/requests/google.dto';
import { UserRequestDto } from '../domains/dtos/requests/user.dto';
// import { RatingEntity } from '../domains/entities/rating.entity';
import { UserEntity } from '../domains/entities/user.entity';
import { UserMovieListEntity } from '../domains/entities/user-movie-list.entity';
import { UserMovieListItemEntity } from '../domains/entities/user-movie-list-item.entity';

export interface IUserRepository {
  findUserByEmail(email: string): Promise<UserEntity | null>;
  createUser(user: UserRequestDto): Promise<UserEntity | null>;
  createUserWithGoogleLogin(
    googleAccount: GoogleAccount,
  ): Promise<UserEntity | null>;
  findOrCreateFavoriteList(userId: string): Promise<UserMovieListEntity>;
  checkMovieExists(listId: string, tmdbId: string);
  addMovieToList(listId: string, tmdbId: string);
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity, 'postgresConnection')
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserMovieListEntity, 'postgresConnection')
    private readonly userMovieListRepository: Repository<UserMovieListEntity>,
    @InjectRepository(UserMovieListItemEntity, 'postgresConnection')
    private readonly userMovieListItemRepository: Repository<UserMovieListItemEntity>,
    // @InjectRepository(RatingEntity, 'postgresConnection')
    // private readonly ratingRepository: Repository<RatingEntity>,
  ) {}

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(user: UserRequestDto): Promise<UserEntity> {
    return this.userRepository.save({ ...user, createdAt: new Date() });
  }

  async findUserById(userId: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    return user || null;
  }

  async createUserWithGoogleLogin(
    googleAccount: GoogleAccount,
  ): Promise<UserEntity> {
    return this.userRepository.save({
      email: googleAccount.email,
      avatar: googleAccount.avatar,
      socialProvider: 'google',
      password: '',
      createdAt: new Date(),
    });
  }

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
}
