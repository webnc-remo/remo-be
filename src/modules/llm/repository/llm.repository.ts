import { Injectable } from '@nestjs/common';
import axios from 'axios';

import {
  IGeminiApiResponse,
  INavigateResponse,
} from '../../../common/gemini-api-response.dto';
import { PageOptionsDto } from '../../../common/page-options.dto';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { MoviesRepository } from '../../movie/repository/movie.repository';

@Injectable()
export class LlmRepository {
  private readonly maxResults = 100;

  constructor(
    private readonly configService: ApiConfigService,
    private readonly movieRepository: MoviesRepository,
  ) {}

  async search(
    pageOptionsDto: PageOptionsDto,
  ): Promise<string[] | number | undefined> {
    const { q } = pageOptionsDto;
    const { apiKey, retrieverUrl } = this.configService.geminiConfig;

    if (q === undefined) {
      throw new Error('Query cannot empty');
    }

    const navigateResult = await this.handleNavigate(q);

    if (navigateResult !== undefined) {
      return navigateResult;
    }

    try {
      const retrieverResponse = await axios.get<IGeminiApiResponse>(
        retrieverUrl,
        {
          params: {
            llm_api_key: apiKey,
            collection_name: 'movies',
            query: q,
            amount: this.maxResults,
          },
        },
      );

      if (retrieverResponse.data.status === 200) {
        return retrieverResponse.data.data.result;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async handleNavigate(q: string): Promise<number | undefined> {
    const { apiKey, navigateUrl } = this.configService.geminiConfig;

    try {
      const navigateResponse = await axios.post<INavigateResponse>(
        `${navigateUrl}?llm_api_key=${apiKey}&query=${encodeURIComponent(q)}`,
        '',
      );

      if (
        navigateResponse.data.status === 200 &&
        navigateResponse.data.data.route === 'CAST_PAGE'
      ) {
        if (navigateResponse.data.data.params.movie_ids.length > 0) {
          const tmdbId = await this.movieRepository.findTmdbIdByObjectId(
            navigateResponse.data.data.params.movie_ids[0],
          );

          if (tmdbId !== undefined) {
            return tmdbId;
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const regexPattern =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            navigateResponse.data.data.metadata['credits.cast.name'].$regex;

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const regexOptions =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            navigateResponse.data.data.metadata['credits.cast.name'].$options ||
            '';

          const movieIds = await this.movieRepository.findMoviesByRegex(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            regexPattern,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            regexOptions,
          );

          if (movieIds.length > 0) {
            return movieIds[0];
          }
        }
      }
    } catch {
      return undefined;
    }
  }
}
