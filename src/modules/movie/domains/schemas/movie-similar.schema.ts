import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

import { MovieEntity } from './movie.schema';

@Entity('similar')
export class MovieSimilarEntity {
  @ObjectIdColumn() _id?: ObjectId;

  @Column()
  tmdb_id!: number;

  @Column()
  similar_movies!: MovieEntity[];
}
