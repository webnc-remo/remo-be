import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PageOptionsDto } from '../../../common/page-options.dto';
import { AuthUser, PublicRoute } from '../../../decorators';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { UserInfoDto } from '../domains/dtos/user-info.dto';
import { IUserFavMoviesService } from '../services/user-movie-fav.service';

@Controller('/v1/user/fav')
@ApiTags('user')
export class UserFavMoviesController {
  constructor(
    @Inject('IUserFavMoviesService')
    private readonly userService: IUserFavMoviesService,
  ) {}

  @Get('/:tmdbId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add movie to favorite list' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie added to favorite list',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiBearerAuth()
  addFavorite(
    @AuthUser() userInfo: UserInfoDto,
    @Param('tmdbId') tmdbId: string,
  ) {
    return this.userService.addFavorite(userInfo.id, tmdbId);
  }

  @Delete('/:tmdbId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove movie from favorite list' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie removed from favorite list',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiBearerAuth()
  removeFavorite(
    @AuthUser() userInfo: UserInfoDto,
    @Param('tmdbId') tmdbId: string,
  ) {
    return this.userService.removeFavorite(userInfo.id, tmdbId);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get favorite list' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Favorite list retrieved successfully',
  })
  @ApiBearerAuth()
  getFavoriteList(
    @AuthUser() userInfo: UserInfoDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.userService.getFavoriteList(userInfo.id, pageOptionsDto);
  }

  @Get('/check/:tmdbId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check if movie is in favorite list' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns whether movie is in favorites',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiBearerAuth()
  async checkFavorite(
    @AuthUser() userInfo: UserInfoDto,
    @Param('tmdbId') tmdbId: string,
  ) {
    return this.userService.checkFavorite(userInfo.id, tmdbId);
  }

  @Get('/list/:listId')
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
    return this.userService.getListMovies(listId, pageOptionsDto);
  }
}
