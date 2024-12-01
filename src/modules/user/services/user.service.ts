import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { handleError } from '../../../common/utils';
import { RegisterRequestDto } from '../..//auth/domains/dtos/requests/register.dto';
import { ProfileResponse } from '../domains/dtos/responses/profile.dto';
import { UserResponseDto } from '../domains/dtos/responses/user-response.dto';
import { UserRepository } from '../repository/user.repository';

export interface IUserService {
  getUserByEmail(email: string): Promise<UserResponseDto | null>;
  createUser(registerRequest: RegisterRequestDto): Promise<UserResponseDto>;
  getUserProfile(userId: string): Promise<ProfileResponse>;
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

  async getUserByEmail(email: string): Promise<UserResponseDto | null> {
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

  async getUserProfile(userId: string): Promise<ProfileResponse> {
    try {
      const user = await this.userRepository.findUserById(userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const profileResponse: ProfileResponse = {
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
