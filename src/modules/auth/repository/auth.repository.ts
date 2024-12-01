import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DecodedToken } from '../domains/dtos/responses/decoded-token.dto';
import { RefreshTokenEntity } from '../domains/entities/token.entity';

export interface IAuthRepository {
  saveRefreshToken(
    userId: string,
    refreshToken: string,
    decodedToken: DecodedToken,
  ): Promise<RefreshTokenEntity | null>;
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
    decodedToken: DecodedToken,
  ): Promise<RefreshTokenEntity | null> {
    return this.tokenRepository.save({
      userId,
      token: refreshToken,
      iat: new Date(decodedToken.iat * 1000),
      exp: new Date(decodedToken.exp * 1000),
    });
  }
}
