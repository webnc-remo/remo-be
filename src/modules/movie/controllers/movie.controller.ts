import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PublicRoute } from '../../../decorators';
import { MovieEntity } from '../domains/schemas/movie.entity';
import { MoviesService } from '../services/movie.service';

@Controller('/v1/movies')
@ApiTags('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('/search')
  @PublicRoute(true)
  @ApiOperation({ summary: 'Search movies' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Movies retrieved successfully',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movies not found',
  })
  async search(@Query('query') query: string): Promise<MovieEntity[]> {
    const movies = await this.moviesService.search(query);

    return movies;
  }
}
