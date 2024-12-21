import { ObjectId } from 'mongodb';
import { Column, Entity, JoinTable, ManyToMany, ObjectIdColumn } from 'typeorm';

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

  @ManyToMany(() => GenreEntity, (genre) => genre.movies)
  @JoinTable()
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
}
