import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterQuery } from 'mongoose';
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
    const { order, take, skip, q, genre, year } = pageOptionsDto;
    const filter: FilterQuery<any> = { $and: [] }; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (genre && genre.length > 0) {
      filter.$and?.push({ 'genres.name': { $regex: genre, $options: 'i' } }); // eslint-disable-line @typescript-eslint/naming-convention
    }

    if (year && year.length > 0) {
      filter.$and?.push({ release_date: { $gte: `${year}-01-01` } });
    }

    filter.$and?.push({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { original_title: { $regex: q, $options: 'i' } },
        { overview: { $regex: q, $options: 'i' } },
        { tagline: { $regex: q, $options: 'i' } },
        { ['credits.cast.name']: { $regex: q, $options: 'i' } },
        { ['credits.crew.name']: { $regex: q, $options: 'i' } },
      ],
    });

    const [movies, itemCount] = await this.movieRepository.findAndCount({
      where: filter,
      select: [
        'tmdb_id',
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

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount,
    });

    return {
      items: movies,
      meta: pageMetaDto,
    };
  }

  async findByIds(ids: string[], pageOptionsDto: PageOptionsDto) {
    const { order, take, skip } = pageOptionsDto;

    // convert ids to number
    const movieIds = ids.map((id) => Number.parseInt(id, 10));

    const [movies, itemCount] = await this.movieRepository.findAndCount({
      where: { tmdb_id: { $in: movieIds } },
      select: [
        'tmdb_id',
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

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount,
    });

    return {
      items: movies,
      meta: pageMetaDto,
    };
  }

  async getMovieById(id: number) {
    const item = await this.movieRepository.findOne({
      where: {
        tmdb_id: id,
      },
      relations: {
        genres: true,
      },
    });

    return { item };
  }
}
