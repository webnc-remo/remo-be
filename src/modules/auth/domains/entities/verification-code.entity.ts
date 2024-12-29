import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../../../user/domains/entities/user.entity';

@Entity({ name: 'verification_codes' })
export class VerificationCodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 6 })
  code!: string;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @Column({ type: 'uuid' })
  userId!: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
