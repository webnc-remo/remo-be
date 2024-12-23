import { Entity } from 'typeorm';

import { MovieEntity } from './movie.schema';

@Entity('movies_trending_day')
export class MovieTrendingDayEntity extends MovieEntity {}
