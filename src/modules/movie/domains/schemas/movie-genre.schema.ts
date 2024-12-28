import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity('movie_genres')
export class GenreEntity {
  @ObjectIdColumn() _id?: ObjectId;

  @Column()
  id!: number;

  @Column()
  name!: string;
}
