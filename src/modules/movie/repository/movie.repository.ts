import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { PageMetaDto } from '../../../common/page-meta.dto';
import { PageOptionsDto } from '../../../common/page-options.dto';
import { MovieEntity } from '../domains/schemas/movie.schema';

@Injectable()
export class MoviesRepository {
  constructor(
    @InjectRepository(MovieEntity, 'mongodbConnection')
    private readonly movieRepository: MongoRepository<MovieEntity>,
  ) {}

  async search(pageOptionsDto: PageOptionsDto) {
    const { order, take, skip, q } = pageOptionsDto;

    const filter = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { original_title: { $regex: q, $options: 'i' } },
        { overview: { $regex: q, $options: 'i' } },
        { tagline: { $regex: q, $options: 'i' } },
        { ['credits.cast.name']: { $regex: q, $options: 'i' } },
        { ['credits.crew.name']: { $regex: q, $options: 'i' } },
      ],
    };

    const items = await this.movieRepository.find({
      where: filter,
      select: [
        'tmdbId',
        'title',
        'original_title',
        'poster_path',
        'release_date',
        'vote_average',
        'vote_count',
        'overview',
        'popularity',
        'adult',
        'backdrop_path',
        'original_language',
        'video',
        'tagline',
        'genres',
      ],
      skip,
      take,
      order: { [order]: 'DESC' },
    });

    const itemCount = await this.movieRepository.count(filter);

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount,
    });

    return {
      items,
      meta: pageMetaDto,
    };
  }
}
