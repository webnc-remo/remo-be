import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { handleError, validateHash } from '../../../common/utils';
import { RegisterRequestDto } from '../..//auth/domains/dtos/requests/register.dto';
import { UserRequest } from '../domains/dtos/requests/user.dto';
import { ProfileResponse } from '../domains/dtos/responses/profile.dto';
import { TokenPayload } from '../domains/dtos/responses/token.dto';
import { UserResponseDto } from '../domains/dtos/responses/user-response.dto';
import { UserRepository } from '../repository/user.repository';

export interface IUserService {
  getUserByEmail(email: string): Promise<UserResponseDto | null>;
  createUser(registerRequest: RegisterRequestDto): Promise<UserResponseDto>;
  handleLogin(user: UserRequest): Promise<TokenPayload>;
  getUserProfile(userId: string): Promise<ProfileResponse>;
}

@Injectable()
export class UserService implements IUserService {
  public logger: Logger;

  constructor(
    public configService: ConfigService,
    @Inject('IUserRepository')
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
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

  public async handleLogin(userRequest: UserRequest) {
    try {
      if (!userRequest.email) {
        throw new BadRequestException('Email is required');
      }

      const user = await this.userRepository.findUserByEmail(userRequest.email);

      if (!user) {
        throw new NotFoundException('User is not found');
      }

      const isCorrectPassword = validateHash(
        userRequest.password!,
        user.password,
      );

      if (!isCorrectPassword) {
        throw new BadRequestException('Password is incorrect');
      }

      const tokenPayload: TokenPayload = {
        accessToken: this.jwtService.sign({
          email: userRequest.email,
          id: user.id,
        }),
        user: {
          id: user.id,
          email: userRequest.email,
        },
      };

      return tokenPayload;
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
        createdAt: user.createdAt,
      };

      return profileResponse;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}
