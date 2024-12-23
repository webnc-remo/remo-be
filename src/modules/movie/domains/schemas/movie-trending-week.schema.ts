import { Entity } from 'typeorm';

import { MovieEntity } from './movie.schema';

@Entity('movies_trending_week')
export class MovieTrendingWeekEntity extends MovieEntity {}
