import { Transform } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../../../user/domains/entities/user.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokensEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ type: 'varchar' })
  token!: string;

  @Column({ type: 'timestamp' })
  @Transform(({ value }: { value: Date }) => value.getTime() / 1000, {
    toPlainOnly: true,
  })
  iat!: Date;

  @Column({ type: 'timestamp' })
  @Transform(({ value }: { value: Date }) => value.getTime() / 1000, {
    toPlainOnly: true,
  })
  exp!: Date;
}
