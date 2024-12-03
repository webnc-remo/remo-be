import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DecodedTokenDto } from '../domains/dtos/responses/decoded-token.dto';
import { RefreshTokenEntity } from '../domains/entities/token.entity';

export interface IAuthRepository {
  saveRefreshToken(
    userId: string,
    refreshToken: string,
    decodedToken: DecodedTokenDto,
  ): Promise<RefreshTokenEntity | null>;
  removeRefreshToken(
    userId: string,
    token: string,
  ): Promise<RefreshTokenEntity>;
  isTokenExist(userId: string, refreshToken: string): Promise<boolean>;
}

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly tokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async saveRefreshToken(
    userId: string,
    refreshToken: string,
    decodedToken: DecodedTokenDto,
  ): Promise<RefreshTokenEntity | null> {
    return this.tokenRepository.save({
      userId,
      token: refreshToken,
      iat: new Date(decodedToken.iat * 1000),
      exp: new Date(decodedToken.exp * 1000),
    });
  }

  async removeRefreshToken(
    userId: string,
    token: string,
  ): Promise<RefreshTokenEntity> {
    const removedToken = await this.tokenRepository.findOne({
      where: {
        userId,
        token,
      },
    });

    if (!removedToken) {
      throw new NotFoundException(`User ${userId} already logged out`);
    }

    const result = await this.tokenRepository.remove(removedToken);

    return result;
  }

  async isTokenExist(userId: string, refreshToken: string): Promise<boolean> {
    const token = await this.tokenRepository.findOne({
      where: {
        userId,
        token: refreshToken,
      },
    });

    return Boolean(token);
  }
}
