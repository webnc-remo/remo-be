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
import { MailService } from '../../mail/mail.service';
import { UserInfoDto } from '../../user/domains/dtos/user-info.dto';
import { IUserService } from '../../user/services/user.service';
import { LoginRequestDto } from '../domains/dtos/requests/login.dto';
import { RefreshTokenRequestDto } from '../domains/dtos/requests/refresh-token.dto';
import { RegisterRequestDto } from '../domains/dtos/requests/register.dto';
import { DecodedTokenDto } from '../domains/dtos/responses/decoded-token.dto';
import { LoginResponseDto } from '../domains/dtos/responses/login.dto';
import { LogoutResponseDto } from '../domains/dtos/responses/logout.dto';
import { RegisterResponseDto } from '../domains/dtos/responses/register.dto';
import { TokenPayloadResponseDto } from '../domains/dtos/responses/token.dto';
import { AuthRepository } from '../repository/auth.repository';
import { VerificationCodeRepository } from '../repository/verification-code.repository';

export interface IAuthService {
  handleRegister(
    registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto | null>;
  handleLogin(
    loginResponseDto: LoginRequestDto,
  ): Promise<LoginResponseDto | null>;
  handleLogout(
    user: UserInfoDto,
    refreshToken: RefreshTokenRequestDto,
  ): Promise<LogoutResponseDto | null>;
  handleGoogleLogin(
    loginResponseDto: LoginRequestDto,
  ): Promise<LoginResponseDto | null>;
  renewToken(
    refreshToken: RefreshTokenRequestDto,
  ): Promise<TokenPayloadResponseDto>;
  verifyEmail(
    user: UserInfoDto,
    code: string,
  ): Promise<TokenPayloadResponseDto>;
  resendVerificationCode(user: UserInfoDto): Promise<{ message: string }>;
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
    private readonly mailService: MailService,
    private readonly verificationCodeRepository: VerificationCodeRepository,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  private generateVerificationCode(): string {
    return Math.floor(100_000 + Math.random() * 900_000).toString();
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

      const userInfo: UserInfoDto = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role || 'USER',
        isVerified: user.isVerified || false,
      };

      // Generate tokens
      const refreshToken = await this.signRefreshToken(userInfo);
      const accessToken = this.jwtService.sign(userInfo);

      // Generate and save verification code
      const code = this.generateVerificationCode();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await this.verificationCodeRepository.createVerificationCode(
        user.id,
        code,
        expiresAt,
      );

      await this.mailService.sendVerificationCode(user.email!, code);

      return {
        accessToken,
        refreshToken,
        user: userInfo,
      };
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  private async signRefreshToken(userInfo: UserInfoDto): Promise<string> {
    try {
      const refreshToken: string = this.jwtService.sign(userInfo, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRED'),
      });

      const decodedToken: DecodedTokenDto = this.jwtService.verify(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      await this.authRepository.saveRefreshToken(
        userInfo.id,
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

      const userInfo: UserInfoDto = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
      };
      const refreshToken = await this.signRefreshToken(userInfo);
      const accessToken = this.jwtService.sign(userInfo);

      return {
        accessToken,
        refreshToken,
        user: userInfo,
      };
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  public async handleLogout(
    user: UserInfoDto,
    refreshToken: RefreshTokenRequestDto,
  ): Promise<LogoutResponseDto | null> {
    try {
      const removedToken = await this.authRepository.removeRefreshToken(
        user.id,
        refreshToken.refreshToken,
      );

      return {
        message: 'Logged out',
        userId: removedToken.user.id,
      };
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  public async handleGoogleLogin(
    userInfo: UserInfoDto,
  ): Promise<LoginResponseDto | null> {
    try {
      const refreshToken = await this.signRefreshToken(userInfo);
      const accessToken = this.jwtService.sign(userInfo);

      return {
        accessToken,
        refreshToken,
        user: userInfo,
      };
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async renewToken(
    refreshToken: RefreshTokenRequestDto,
  ): Promise<TokenPayloadResponseDto> {
    try {
      const secretKey =
        this.configService.get<string>('JWT_REFRESH_SECRET') ??
        'default_token_key';
      const decoded: DecodedTokenDto = this.jwtService.verify(
        refreshToken.refreshToken,
        {
          secret: secretKey,
        },
      );
      const userInfoDto: UserInfoDto = {
        id: decoded.id,
        email: decoded.email,
      };

      const isTokenExisted = await this.authRepository.isTokenExist(
        userInfoDto.id,
        refreshToken.refreshToken,
      );

      if (!isTokenExisted) {
        throw new NotFoundException('Token not found');
      }

      const [newRefreshToken] = await Promise.all([
        this.signRefreshToken(userInfoDto),
        this.authRepository.removeRefreshToken(
          userInfoDto.id,
          refreshToken.refreshToken,
        ),
      ]);

      const tokenPayload: TokenPayloadResponseDto = {
        accessToken: this.jwtService.sign(userInfoDto),
        refreshToken: newRefreshToken,
        user: userInfoDto,
      };

      return tokenPayload;
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async verifyEmail(
    user: UserInfoDto,
    code: string,
  ): Promise<TokenPayloadResponseDto> {
    try {
      const verificationCode =
        await this.verificationCodeRepository.findValidCode(user.id, code);

      if (!verificationCode) {
        throw new BadRequestException('Invalid or expired verification code');
      }

      await this.authRepository.removeAllUserTokens(user.id);

      await this.userService.verifyUser(user.id);

      await this.verificationCodeRepository.deleteCode(verificationCode.id);

      const userInfo: UserInfoDto = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role || 'USER',
        isVerified: true,
      };

      const refreshToken = await this.signRefreshToken(userInfo);
      const accessToken = this.jwtService.sign(userInfo);

      return {
        accessToken,
        refreshToken,
        user: userInfo,
      };
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }

  async resendVerificationCode(
    user: UserInfoDto,
  ): Promise<{ message: string }> {
    try {
      if (user.isVerified) {
        throw new BadRequestException('User is already verified');
      }

      await this.verificationCodeRepository.deleteExistingCode(user.id);

      const code = this.generateVerificationCode();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await this.verificationCodeRepository.createVerificationCode(
        user.id,
        code,
        expiresAt,
      );

      await this.mailService.sendVerificationCode(user.email!, code);

      return {
        message: 'Verification code has been sent to your email',
      };
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }
}
