import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PageOptionsDto } from '../../../common/page-options.dto';
import { PublicRoute } from '../../../decorators';
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
  async search(@Query() pageOptionsDto: PageOptionsDto) {
    const movies = await this.moviesService.search(pageOptionsDto);

    return movies;
  }

  @Get('/trending/:type')
  @PublicRoute(true)
  @ApiOperation({ summary: 'Get trending movies' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Movies retrieved successfully',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movies not found',
  })
  async trending(@Param('type') type: string) {
    const movies = await this.moviesService.trending(type);

    return { results: movies };
  }

  @Get('/:id')
  @PublicRoute(true)
  @ApiOperation({ summary: 'Get movie by id' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Movie retrieved successfully',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movie not found',
  })
  async getMovieById(@Param('id') id: string) {
    const numberId = Number.parseInt(id, 10);
    const movie = await this.moviesService.getMovieById(numberId);

    return movie;
  }

  @Get('/genres')
  @PublicRoute(true)
  @ApiOperation({ summary: 'Get all genres' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Genres retrieved successfully',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Genres not found',
  })
  async getGenres() {
    const genres = await this.moviesService.getGenres();

    return genres;
  }
}
