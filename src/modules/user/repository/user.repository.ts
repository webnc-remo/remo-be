import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GoogleAccount } from '../../auth/domains/dtos/requests/google.dto';
import { UserRequestDto } from '../domains/dtos/requests/user.dto';
import { UserEntity } from '../domains/entities/user.entity';

export interface IUserRepository {
  findUserByEmail(email: string): Promise<UserEntity | null>;
  createUser(user: UserRequestDto): Promise<UserEntity | null>;
  createUserWithGoogleLogin(
    googleAccount: GoogleAccount,
  ): Promise<UserEntity | null>;
  verifyUser(userId: string): Promise<void>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity, 'postgresConnection')
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(user: UserRequestDto): Promise<UserEntity> {
    return this.userRepository.save({ ...user, createdAt: new Date() });
  }

  async findUserById(userId: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    return user || null;
  }

  async createUserWithGoogleLogin(
    googleAccount: GoogleAccount,
  ): Promise<UserEntity> {
    return this.userRepository.save({
      email: googleAccount.email,
      avatar: googleAccount.avatar,
      socialProvider: 'google',
      password: '',
      createdAt: new Date(),
      isVerified: true,
    });
  }

  async verifyUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, { isVerified: true });
  }
}
