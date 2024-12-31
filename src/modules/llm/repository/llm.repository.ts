import { BadGatewayException, Injectable } from '@nestjs/common';
import axios from 'axios';

import { IGeminiApiResponse } from '../../../common/gemini-api-response.dto';
import { PageOptionsDto } from '../../../common/page-options.dto';
import { ApiConfigService } from '../../../shared/services/api-config.service';

@Injectable()
export class LlmRepository {
  private readonly maxResults = 500;

  constructor(private readonly configService: ApiConfigService) {}

  async search(pageOptionsDto: PageOptionsDto): Promise<string[]> {
    const { q } = pageOptionsDto;
    const { apiKey, retrieverUrl, movieCollection } =
      this.configService.geminiConfig;

    const params: Record<string, string | number | undefined> = {
      gemini_api_key: apiKey,
      collection_name: movieCollection,
      query: q,
      amount: this.maxResults,
    };

    const response = await axios.get<IGeminiApiResponse>(retrieverUrl, {
      params,
    });

    if (response.data.status === 200) {
      return response.data.data.result;
    }

    throw new BadGatewayException('Failed to retrieve similar movies');
  }
}
