import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

import { VerificationCodeEntity } from '../domains/entities/verification-code.entity';

@Injectable()
export class VerificationCodeRepository {
  constructor(
    @InjectRepository(VerificationCodeEntity, 'postgresConnection')
    private readonly repository: Repository<VerificationCodeEntity>,
  ) {}

  async createVerificationCode(
    userId: string,
    code: string,
    expiresAt: Date,
  ): Promise<VerificationCodeEntity> {
    return this.repository.save({
      userId,
      code,
      expiresAt,
    });
  }

  async findValidCode(
    userId: string,
    code: string,
  ): Promise<VerificationCodeEntity | null> {
    return this.repository.findOne({
      where: {
        userId,
        code,
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  async deleteCode(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
