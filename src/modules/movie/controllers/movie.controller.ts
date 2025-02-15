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
import { LLMSearchService } from '../../../modules/llm/service/llm.service';
import { MoviesService } from '../services/movie.service';

@Controller('/v1/movies')
@ApiTags('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly llmService: LLMSearchService,
  ) {}

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
    const { isLLM } = pageOptionsDto;

    if (isLLM && isLLM.length > 0) {
      const movies = await this.llmService.search(pageOptionsDto);

      return movies;
    }

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

  @Get('/similar/:id')
  @PublicRoute(true)
  @ApiOperation({ summary: 'Get similar movies' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Similar movies retrieved successfully',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Similar movies not found',
  })
  async getSimilarMovies(@Param('id') id: string) {
    const numberId = Number.parseInt(id, 10);
    const movies = await this.moviesService.getSimilarMovies(numberId);

    return { results: movies };
  }

  @Get('/popular')
  @PublicRoute(true)
  @ApiOperation({ summary: 'Get popular movies' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Movies retrieved successfully',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movies not found',
  })
  async popular() {
    const movies = await this.moviesService.popular();

    return { results: movies };
  }

  @Get('/now-playing')
  @PublicRoute(true)
  @ApiOperation({ summary: 'Get now playing movies' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Movies retrieved successfully',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movies not found',
  })
  async nowPlaying() {
    const movies = await this.moviesService.getNowPlayingMovies();

    return { results: movies };
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
}
