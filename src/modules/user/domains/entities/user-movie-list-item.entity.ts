import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserMovieListEntity } from './user-movie-list.entity';

@Entity({ name: 'user_movie_list_items' })
export class UserMovieListItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UserMovieListEntity, (list) => list.items, {
    onDelete: 'CASCADE',
  })
  list!: UserMovieListEntity;

  @Column({ type: 'varchar' })
  tmdb_id!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
