import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { handleError } from '../../../common/utils';
import { RegisterRequestDto } from '../..//auth/domains/dtos/requests/register.dto';
import { GoogleAccount } from '../../auth/domains/dtos/requests/google.dto';
import { ProfileResponseDto } from '../domains/dtos/responses/profile.dto';
import { SuccessResponse } from '../domains/dtos/responses/success-response.dto';
import { UserInfoDto } from '../domains/dtos/user-info.dto';
import { UserEntity } from '../domains/entities/user.entity';
import { UserRepository } from '../repository/user.repository';

export interface IUserService {
  getUserByEmail(email: string): Promise<UserEntity | null>;
  createUser(registerRequest: RegisterRequestDto): Promise<UserInfoDto>;
  getUserProfile(userId: string): Promise<ProfileResponseDto>;
  createUserWithGoogleLogin(
    googleAccount: GoogleAccount,
  ): Promise<UserEntity | null>;
  addFavorite(userId: string, tmdbId: string): Promise<SuccessResponse>;
}

@Injectable()
export class UserService implements IUserService {
  public logger: Logger;

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: UserRepository,
  ) {
    this.logger = new Logger(UserService.name);
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    try {
      const user = await this.userRepository.findUserByEmail(email);

      return user;
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async createUser(registerRequest: RegisterRequestDto): Promise<UserInfoDto> {
    try {
      const userEntity = await this.userRepository.createUser(registerRequest);
      const user: UserInfoDto = {
        id: userEntity.id,
        email: userEntity.email,
        fullName: userEntity.fullName,
        avatar: userEntity.avatar,
      };

      return user;
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async getUserProfile(userId: string): Promise<ProfileResponseDto> {
    try {
      const user = await this.userRepository.findUserById(userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const profileResponse: ProfileResponseDto = {
        id: user.id,
        email: user.email ?? '',
        avatar: user.avatar ?? '',
        createdAt: user.createdAt,
      };

      return profileResponse;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async createUserWithGoogleLogin(
    googleAccount: GoogleAccount,
  ): Promise<UserEntity | null> {
    try {
      const user =
        await this.userRepository.createUserWithGoogleLogin(googleAccount);

      return user;
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async addFavorite(userId: string, tmdbId: string) {
    try {
      const favoriteList =
        await this.userRepository.findOrCreateFavoriteList(userId);
      const movieExists = await this.userRepository.checkMovieExists(
        favoriteList.id,
        tmdbId,
      );

      if (movieExists) {
        throw new ConflictException(`Movie with id ${tmdbId} already exists`);
      }

      await this.userRepository.addMovieToList(favoriteList.id, tmdbId);

      return new SuccessResponse('Movie added to favorite list');
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }
}
