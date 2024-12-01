import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { handleError } from '../../../common/utils';
import { RegisterRequestDto } from '../..//auth/domains/dtos/requests/register.dto';
import { ProfileResponseDto } from '../domains/dtos/responses/profile.dto';
import { UserResponseDto } from '../domains/dtos/responses/user-response.dto';
import { UserEntity } from '../domains/entities/user.entity';
import { UserRepository } from '../repository/user.repository';

export interface IUserService {
  getUserByEmail(email: string): Promise<UserEntity | null>;
  createUser(registerRequest: RegisterRequestDto): Promise<UserResponseDto>;
  getUserProfile(userId: string): Promise<ProfileResponseDto>;
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

  async createUser(
    registerRequest: RegisterRequestDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.createUser(registerRequest);

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
}
