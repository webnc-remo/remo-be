import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { handleError } from '../../../common/utils';
import { RegisterRequestDto } from '../..//auth/domains/dtos/requests/register.dto';
import { GoogleAccount } from '../../auth/domains/dtos/requests/google.dto';
import { ProfileResponseDto } from '../domains/dtos/responses/profile.dto';
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
  verifyUser(userId: string): Promise<void>;
  updateUserPassword(userId: string, password: string): Promise<void>;
  getUserById(userId: string): Promise<UserEntity | null>;
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

  async verifyUser(userId: string): Promise<void> {
    await this.userRepository.verifyUser(userId);
  }

  async updateUserPassword(userId: string, password: string): Promise<void> {
    await this.userRepository.updatePassword(userId, password);
  }

  async getUserById(userId: string): Promise<UserEntity | null> {
    try {
      const user = await this.userRepository.findUserById(userId);

      return user;
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }
}
