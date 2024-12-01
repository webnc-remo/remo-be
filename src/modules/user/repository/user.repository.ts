import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRequest } from '../domains/dtos/requests/user.dto';
import { UserEntity } from '../domains/entities/user.entity';

export interface IUserRepository {
  findUserByEmail(email: string): Promise<UserEntity | null>;
  createUser(user: UserRequest): Promise<UserEntity | null>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(user: UserRequest): Promise<UserEntity> {
    return this.userRepository.save({ ...user, createdAt: new Date() });
  }

  async findUserById(userId: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    return user || null;
  }
}
