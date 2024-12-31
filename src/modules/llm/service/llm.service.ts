import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { PageMetaDto } from '../../../common/page-meta.dto';
import { PageOptionsDto } from '../../../common/page-options.dto';
import { LlmRepository } from '../repository/llm.repository';

// src/llm-search/llm-search.service.ts
@Injectable()
export class LLMSearchService {
  public logger: Logger;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly llmRepository: LlmRepository,
  ) {
    this.logger = new Logger(LLMSearchService.name);
  }

  private generateCacheKey(query: string): string {
    return `llm_search:${query}`;
  }

  async search(pageOptionsDto: PageOptionsDto) {
    const { q, skip, take } = pageOptionsDto;

    if (q === undefined) {
      throw new Error('Query cannot empty');
    }

    const cacheKey = this.generateCacheKey(q);
    let allResults = (await this.cacheManager.get<string[]>(cacheKey)) || null;

    if (!allResults) {
      allResults = await this.llmRepository.search(pageOptionsDto);
      await this.cacheManager.set(cacheKey, allResults, 3_600_000); // 1 hour cache
    }

    const paginatedResults = allResults.slice(skip, skip + take);
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: allResults.length,
    });

    return {
      movieIDs: paginatedResults,
      pageMetaDto,
    };
  }
}
