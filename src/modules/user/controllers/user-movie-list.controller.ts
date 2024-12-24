import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../common/page-options.dto';
import { PublicRoute } from '../../../decorators';
import { IUserFavMoviesService } from '../services/user-movie-fav.service';

@Controller('/v1/lists')
@ApiTags('movie-lists')
export class UserMovieListController {
  constructor(
    @Inject('IUserFavMoviesService')
    private readonly userFavMoviesService: IUserFavMoviesService,
  ) {}

  @Get('/share/:listId')
  @PublicRoute(true)
  @ApiOperation({ summary: 'Get movies from list' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List movies retrieved successfully',
  })
  getListMovies(
    @Param('listId') listId: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.userFavMoviesService.getListMovies(listId, pageOptionsDto);
  }
}
