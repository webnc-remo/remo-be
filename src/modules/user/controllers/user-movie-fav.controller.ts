import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
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
import { AuthUser } from '../../../decorators';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { UserInfoDto } from '../domains/dtos/user-info.dto';
import { IUserFavMoviesService } from '../services/user-movie-fav.service';

@Controller('/v1/user/fav')
@ApiTags('user')
export class UserFavMoviesController {
  constructor(
    @Inject('IUserFavMoviesService')
    private readonly userFavService: IUserFavMoviesService,
  ) {}

  @Post('/:tmdbId')
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
    return this.userFavService.addFavorite(userInfo.id, tmdbId);
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
    return this.userFavService.removeFavorite(userInfo.id, tmdbId);
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
    return this.userFavService.getFavoriteList(userInfo, pageOptionsDto);
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
    return this.userFavService.checkFavorite(userInfo.id, tmdbId);
  }
}
