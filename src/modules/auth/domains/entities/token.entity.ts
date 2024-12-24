import { Transform } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '../../../user/domains/entities/user.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokensEntity, {
    onDelete: 'CASCADE',
  })
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
