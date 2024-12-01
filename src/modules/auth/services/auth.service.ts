import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { generateHash, handleError, validateHash } from '../../../common/utils';
import { IUserService } from '../../user/services/user.service';
import { LoginRequestDto } from '../domains/dtos/requests/login.dto';
import { RegisterRequestDto } from '../domains/dtos/requests/register.dto';
import { DecodedToken } from '../domains/dtos/responses/decoded-token.dto';
import { LoginResponseDto } from '../domains/dtos/responses/login.dto';
import { RegisterResponseDto } from '../domains/dtos/responses/register.dto';
import { AuthRepository } from '../repository/auth.repository';

export interface IAuthService {
  handleRegister(
    registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto | null>;
  handleLogin(
    loginResponseDto: LoginRequestDto,
  ): Promise<LoginResponseDto | null>;
}

@Injectable()
export class AuthService implements IAuthService {
  public logger: Logger;

  constructor(
    public configService: ConfigService,
    @Inject('IAuthRepository')
    private readonly authRepository: AuthRepository,
    @Inject('IUserService')
    private readonly userService: IUserService,

    private readonly jwtService: JwtService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async handleRegister(
    registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto | null> {
    try {
      if (!registerRequestDto.email) {
        throw new BadRequestException('Email is required');
      }

      const existedUser = await this.userService.getUserByEmail(
        registerRequestDto.email,
      );

      if (existedUser) {
        throw new BadRequestException('Email is already existed');
      }

      if (!registerRequestDto.password) {
        throw new BadRequestException('Password is required');
      }

      const hashedPassword = generateHash(registerRequestDto.password);

      const user = await this.userService.createUser({
        ...registerRequestDto,
        password: hashedPassword,
      });

      const refreshToken = await this.signRefreshToken(user.id);
      const accessToken = this.jwtService.sign({ userId: user.id });

      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  private async signRefreshToken(userId: string) {
    try {
      const refreshToken: string = this.jwtService.sign(
        { userId },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRED'),
        },
      );

      const decodedToken: DecodedToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      await this.authRepository.saveRefreshToken(
        userId,
        refreshToken,
        decodedToken,
      );

      return refreshToken;
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  public async handleLogin(
    loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto | null> {
    try {
      if (!loginRequestDto.email) {
        throw new BadRequestException('Email is required');
      }

      if (!loginRequestDto.password) {
        throw new BadRequestException('Password is required');
      }

      const user = await this.userService.getUserByEmail(loginRequestDto.email);

      if (!user) {
        throw new NotFoundException(
          `User with email ${loginRequestDto.email} not found`,
        );
      }

      const isCorrectPassword = validateHash(
        loginRequestDto.password,
        user.password,
      );

      if (!isCorrectPassword) {
        throw new BadRequestException('Password is incorrect');
      }

      const refreshToken = await this.signRefreshToken(user.id);
      const accessToken = this.jwtService.sign({ userId: user.id });

      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }
}
