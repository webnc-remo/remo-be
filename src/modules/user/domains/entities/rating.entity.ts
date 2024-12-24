import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '../../../user/domains/entities/user.entity';

@Entity({ name: 'ratings' })
export class RatingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UserEntity, (user) => user.ratings, {
    onDelete: 'CASCADE',
  })
  user!: UserEntity;

  @Column({ type: 'varchar' })
  rating!: string;

  @Column({ type: 'varchar', nullable: true })
  review!: string | null;

  @Column({ type: 'varchar' })
  tmdb_id!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
