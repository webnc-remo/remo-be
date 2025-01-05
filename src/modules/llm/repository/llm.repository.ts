import { BadGatewayException, Injectable } from '@nestjs/common';
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

  async search(pageOptionsDto: PageOptionsDto): Promise<string[] | number> {
    const { q } = pageOptionsDto;
    const { apiKey, retrieverUrl, navigateUrl } =
      this.configService.geminiConfig;

    try {
      const navigateResponse = await axios.post<INavigateResponse>(
        `${navigateUrl}?llm_api_key=${apiKey}&query=${encodeURIComponent(q ?? '')}`,
        '', // empty body
        {
          headers: {
            accept: 'application/json',
          },
        },
      );

      // If navigate returns valid movie_ids, use them
      if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        navigateResponse.data.status === 200 &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        navigateResponse.data.data.params.movie_ids.length > 0
      ) {
        const tmdbId = await this.movieRepository.findTmdbIdByObjectId(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          navigateResponse.data.data.params.movie_ids[0],
        );

        if (tmdbId !== undefined) {
          return tmdbId;
        }
      }

      // Otherwise, fallback to retriever API
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const retrieverResponse = await axios.get<IGeminiApiResponse>(
        retrieverUrl,
        {
          params: {
            gemini_api_key: apiKey,
            query: q,
            amount: this.maxResults,
          },
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (retrieverResponse.data.status === 200) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return retrieverResponse.data.data.result;
      }

      throw new BadGatewayException('Failed to retrieve similar movies');
    } catch {
      throw new BadGatewayException('Failed to retrieve similar movies');
    }
  }
}
