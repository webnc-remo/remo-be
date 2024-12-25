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
import { IUserWatchlistService } from '../services/user-movie-watchlist.service';

@Controller('/v1/user/watchlist')
@ApiTags('user')
export class UserWatchlistController {
  constructor(
    @Inject('IUserWatchlistService')
    private readonly userService: IUserWatchlistService,
  ) {}

  @Post('/:tmdbId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add movie to watchlist' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie added to watchlist',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiBearerAuth()
  addWatchlist(
    @AuthUser() userInfo: UserInfoDto,
    @Param('tmdbId') tmdbId: string,
  ) {
    return this.userService.addWatchlist(userInfo.id, tmdbId);
  }

  @Delete('/:tmdbId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove movie from watchlist' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie removed from watchlist',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiBearerAuth()
  removeWatchlist(
    @AuthUser() userInfo: UserInfoDto,
    @Param('tmdbId') tmdbId: string,
  ) {
    return this.userService.removeWatchlist(userInfo.id, tmdbId);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get watchlist' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Watchlist retrieved successfully',
  })
  @ApiBearerAuth()
  getWatchlist(
    @AuthUser() userInfo: UserInfoDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.userService.getWatchlist(userInfo, pageOptionsDto);
  }

  @Get('/check/:tmdbId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check if movie is in watchlist' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns whether movie is in watchlist',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiBearerAuth()
  async checkWatchlist(
    @AuthUser() userInfo: UserInfoDto,
    @Param('tmdbId') tmdbId: string,
  ) {
    return this.userService.checkWatchlist(userInfo.id, tmdbId);
  }
}
