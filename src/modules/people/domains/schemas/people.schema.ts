import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

class MovieMinimum {
  @Column()
  id!: number;

  @Column()
  title!: string;

  @Column()
  backdrop_path!: string;

  @Column()
  character!: string;
}

class MovieCredit {
  @Column(() => MovieMinimum)
  cast!: MovieMinimum[];

  @Column(() => MovieMinimum)
  crew!: MovieMinimum[];
}

@Entity('people')
export class PeopleEntity {
  @ObjectIdColumn() id?: ObjectId;

  @Column()
  tmdb_id!: number;

  @Column()
  adult!: boolean;

  @Column()
  also_known_as!: string[];

  @Column()
  biography!: string;

  @Column()
  birthday!: string;

  @Column()
  deathday!: string;

  @Column()
  name!: string;

  @Column()
  gender!: number;

  @Column()
  profile_path!: string;

  @Column()
  popularity!: number;

  @Column()
  place_of_birth!: string;

  @Column(() => MovieCredit)
  movie_credits!: MovieCredit;
}
