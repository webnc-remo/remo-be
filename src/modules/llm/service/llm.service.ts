import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { PageMetaDto } from '../../../common/page-meta.dto';
import { PageOptionsDto } from '../../../common/page-options.dto';
import { MoviesRepository } from '../../../modules/movie/repository/movie.repository';
import { LlmRepository } from '../repository/llm.repository';

@Injectable()
export class LLMSearchService {
  public logger: Logger;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly llmRepository: LlmRepository,
    private readonly movieRepository: MoviesRepository,
  ) {
    this.logger = new Logger(LLMSearchService.name);
  }

  private generateCacheKey(query: string): string {
    return `llm_search:${query}`;
  }

  async search(pageOptionsDto: PageOptionsDto) {
    const { q, skip, take, rating, genre, year } = pageOptionsDto;

    if (q === undefined) {
      throw new Error('Query cannot empty');
    }

    const cacheKey = this.generateCacheKey(q);

    let allResults =
      (await this.cacheManager.get<string[] | number>(cacheKey)) || undefined;

    if (allResults === undefined) {
      allResults = await this.llmRepository.search(pageOptionsDto);
      await this.cacheManager.set(cacheKey, allResults, 3_600_000); // 1 hour cache
    }

    if (typeof allResults === 'number') {
      return allResults;
    }

    const movies = await this.movieRepository.findByObjectIds(
      allResults as string[],
    );

    let filteredMovies = [...movies.items];

    if (genre && genre.length > 0) {
      filteredMovies = filteredMovies.filter((_movie) =>
        _movie.genres.some((g) =>
          g.name.toLowerCase().includes(genre.toLowerCase()),
        ),
      );
    }

    if (year && year.length > 0) {
      filteredMovies = filteredMovies.filter(
        (_movie) => _movie.release_date >= `${year}-01-01`,
      );
    }

    if (rating) {
      const floatRating = Number.parseFloat(rating) / 10;
      filteredMovies = filteredMovies.filter(
        (_movie) => _movie.vote_average >= floatRating,
      );
    }

    const paginatedResults = filteredMovies.slice(skip, skip + take);
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: filteredMovies.length,
    });

    return {
      items: paginatedResults,
      meta: pageMetaDto,
    };
  }
}
