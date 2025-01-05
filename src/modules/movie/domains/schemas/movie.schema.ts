import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

import { GenreEntity } from './movie-genre.schema';

class BelongsToCollection {
  @Column()
  id!: number;

  @Column()
  name!: string;

  @Column()
  poster_path!: string;

  @Column()
  backdrop_path!: string;
}

class ProductionCompany {
  @Column()
  id!: number;

  @Column({ nullable: true })
  logo_path!: string;

  @Column()
  name!: string;

  @Column()
  origin_country!: string;
}

class ProductionCountry {
  @Column()
  iso_3166_1!: string;

  @Column()
  name!: string;
}

class SpokenLanguage {
  @Column()
  english_name!: string;

  @Column()
  iso_639_1!: string;

  @Column()
  name!: string;
}

class CreditCast {
  @Column()
  adult!: boolean;

  @Column()
  gender!: number;

  @Column()
  id!: number;

  @Column()
  known_for_department!: string;

  @Column()
  name!: string;

  @Column()
  original_name!: string;

  @Column('float')
  popularity!: number;

  @Column({ nullable: true })
  profile_path!: string;

  @Column()
  cast_id!: number;

  @Column()
  character!: string;

  @Column()
  credit_id!: string;

  @Column()
  order!: number;
}

class CreditCrew {
  @Column()
  adult!: boolean;

  @Column()
  gender!: number;

  @Column()
  id!: number;

  @Column()
  known_for_department!: string;

  @Column()
  name!: string;

  @Column()
  original_name!: string;

  @Column('float')
  popularity!: number;

  @Column({ nullable: true })
  profile_path!: string;

  @Column()
  credit_id!: string;

  @Column()
  department!: string;

  @Column()
  job!: string;
}

class Credits {
  @Column()
  id!: number;

  @Column(() => CreditCast)
  cast!: CreditCast[];

  @Column(() => CreditCrew)
  crew!: CreditCrew[];
}

class Trailers {
  @Column()
  name!: string;

  @Column()
  key!: string;

  @Column()
  site!: string;

  @Column()
  offical!: boolean;

  @Column('date')
  published_at!: string;
}

@Entity('movies')
export class MovieEntity {
  @ObjectIdColumn() id?: ObjectId;

  @Column({ unique: true })
  tmdb_id!: number;

  @Column()
  adult!: boolean;

  @Column()
  backdrop_path!: string;

  @Column(() => BelongsToCollection)
  belongs_to_collection!: BelongsToCollection;

  @Column()
  budget!: number;

  @Column('simple-array')
  categories!: string[];

  @Column()
  genres!: GenreEntity[];

  @Column()
  homepage!: string;

  @Column()
  imdb_id!: string;

  @Column('simple-array')
  origin_country!: string[];

  @Column()
  original_language!: string;

  @Column()
  original_title!: string;

  @Column('text')
  overview!: string;

  @Column('float')
  popularity!: number;

  @Column()
  poster_path!: string;

  @Column(() => ProductionCompany)
  production_companies!: ProductionCompany[];

  @Column(() => ProductionCountry)
  production_countries!: ProductionCountry[];

  @Column('date')
  release_date!: string;

  @Column()
  revenue!: number;

  @Column()
  runtime!: number;

  @Column(() => SpokenLanguage)
  spoken_languages!: SpokenLanguage[];

  @Column()
  status!: string;

  @Column()
  tagline!: string;

  @Column()
  title!: string;

  @Column()
  video!: boolean;

  @Column('float')
  vote_average!: number;

  @Column()
  vote_count!: number;

  @Column(() => Credits)
  credits!: Credits;

  @Column()
  trailers!: Trailers[];
}
