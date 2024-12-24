import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RefreshTokenEntity } from '../../../auth/domains/entities/token.entity';
import { RatingEntity } from './rating.entity';
import { UserMovieListEntity } from './user-movie-list.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  fullName!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  avatar!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  password!: string | null;

  @Column({ type: 'varchar', nullable: true })
  socialProvider!: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokensEntity!: RefreshTokenEntity[];

  @OneToMany(() => UserMovieListEntity, (list) => list.user, {
    cascade: true,
  })
  userMovieLists!: UserMovieListEntity[];

  @OneToMany(() => RatingEntity, (rating) => rating.user, {
    cascade: true,
  })
  ratings!: RatingEntity[];
}
