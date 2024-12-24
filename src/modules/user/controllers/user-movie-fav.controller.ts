import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthUser } from '../../../decorators';
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
}
