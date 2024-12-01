import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRequest } from '../domains/dtos/requests/user.dto';
import { TokenEntity } from '../domains/entities/token.entity';
import { UserEntity } from '../domains/entities/user.entity';

export interface IUserRepository {
  findUserByEmail(email: string): Promise<UserEntity | null>;
  createUser(user: UserRequest): Promise<UserEntity | null>;
  removeToken(token: string): Promise<TokenEntity>;
  isTokenExist(userId: string, refreshToken: string): Promise<boolean>;
  findUserById(userId: string): Promise<UserEntity | null>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user || null;
  }

  async createUser(user: UserRequest): Promise<UserEntity> {
    const createdAt = new Date();
    const newUser = this.userRepository.create({
      ...user,
      createdAt,
    });

    await this.userRepository.save(newUser);

    return newUser;
  }

  async removeToken(token: string): Promise<TokenEntity> {
    const refreshToken = await this.tokenRepository.findOne({
      where: { token },
    });

    if (!refreshToken) {
      throw new NotFoundException('Token not found');
    }

    await this.tokenRepository.remove(refreshToken);

    return refreshToken;
  }

  async isTokenExist(userId: string, refreshToken: string): Promise<boolean> {
    const token = await this.tokenRepository.findOne({
      where: { userId, token: refreshToken },
    });

    return Boolean(token);
  }

  async findUserById(userId: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    return user || null;
  }
}
