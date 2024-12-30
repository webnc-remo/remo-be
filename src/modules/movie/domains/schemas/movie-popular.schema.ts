import { Entity } from 'typeorm';

import { MovieEntity } from './movie.schema';

@Entity('movies_popular')
export class MoviePopularEntity extends MovieEntity {}
