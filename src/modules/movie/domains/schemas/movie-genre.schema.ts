import { Column, Entity, ManyToMany, ObjectId, ObjectIdColumn } from 'typeorm';

import { MovieEntity } from './movie.schema';

@Entity('movie_genres')
export class GenreEntity {
  @ObjectIdColumn() id?: ObjectId;

  @Column()
  name!: string;

  @ManyToMany(() => MovieEntity, (movie) => movie.genres)
  movies!: MovieEntity[];
}
