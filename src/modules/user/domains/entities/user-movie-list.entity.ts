import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../../../user/domains/entities/user.entity';
import { UserMovieListItemEntity } from './user-movie-list-item.entity';

@Entity({ name: 'user_movie_lists' })
export class UserMovieListEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  listName!: string;

  @Column({ type: 'varchar', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', nullable: true })
  imageUrl!: string | null;

  @Column({ type: 'varchar', default: 'custom' })
  listType!: 'custom' | 'favorite' | 'wishlist';

  @Column({ type: 'boolean', default: true })
  isPublic!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.userMovieLists, {
    onDelete: 'CASCADE',
  })
  user!: UserEntity;

  @OneToMany(() => UserMovieListItemEntity, (item) => item.list, {
    cascade: true,
  })
  items!: UserMovieListItemEntity[];
}
