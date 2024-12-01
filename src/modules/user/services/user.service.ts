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

import { generateHash, handleError, validateHash } from '../../../common/utils';
import { TokenBody } from '../domains/dtos/requests/token.dto';
import { UserRequest } from '../domains/dtos/requests/user.dto';
import { ProfileResponse } from '../domains/dtos/responses/profile.dto';
import { TokenPayload } from '../domains/dtos/responses/token.dto';
import { UserResponse } from '../domains/dtos/responses/user-response.dto';
import { TokenEntity } from '../domains/entities/token.entity';
import { UserRepository } from '../repository/user.repository';

export interface IUserService {
  handleLogin(user: UserRequest): Promise<TokenPayload>;
  handleRegister(user: UserRequest): Promise<UserResponse>;
  handleLogout(token: TokenBody): Promise<TokenEntity>;
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

  async handleLogout(token: TokenBody): Promise<TokenEntity> {
    try {
      const removeToken = await this.userRepository.removeToken(token.token);

      return removeToken;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async handleRegister(userRequest: UserRequest): Promise<UserResponse> {
    try {
      if (!userRequest.email) {
        throw new BadRequestException('Email is required');
      }

      const existedUser = await this.userRepository.findUserByEmail(
        userRequest.email,
      );

      if (existedUser) {
        throw new BadRequestException('Email is already existed');
      }

      if (!userRequest.password) {
        throw new BadRequestException('Password is required');
      }

      const hashedPassword = generateHash(userRequest.password);

      const user = await this.userRepository.createUser({
        ...userRequest,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      this.logger.error(error);

      throw error;
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
