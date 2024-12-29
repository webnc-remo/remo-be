import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../common/page-options.dto';
import { AuthUser, PublicRoute } from '../../../decorators';
import { RateMovieDto } from '../domains/dtos/rate-movie.dto';
import { UserInfoDto } from '../domains/dtos/user-info.dto';
import { RatingService } from '../services/rating.service';

@Controller('/v1')
@ApiTags('User Movie Ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('/:movieId/rating')
  @PublicRoute(true)
  @ApiOperation({ summary: 'Get movie rating' })
  @HttpCode(HttpStatus.ACCEPTED)
  async getMovieRating(@Param('movieId') movieId: string) {
    const rating = await this.ratingService.getUserRatingByMovieId(
      Number(movieId),
    );

    return rating;
  }

  @Post('/user/ratings/:movieId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rate a movie' })
  async rateMovie(
    @Param('movieId') movieId: string,
    @Body() rateMovieDto: RateMovieDto,
    @AuthUser() userInfo: UserInfoDto,
  ) {
    return this.ratingService.rateMovie(movieId, userInfo, rateMovieDto);
  }

  @Get('/user/ratings/:movieId')
  @ApiOperation({ summary: 'Get user rating for a specific movie' })
  @ApiBearerAuth()
  async getUserMovieRating(
    @Param('movieId') movieId: string,
    @AuthUser() userInfo: UserInfoDto,
  ) {
    return this.ratingService.getUserMovieRating(movieId, userInfo);
  }

  @Get('/user/ratings')
  @ApiOperation({ summary: 'Get all ratings by current user' })
  @ApiBearerAuth()
  async getUserRatings(
    @AuthUser() userInfo: UserInfoDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.ratingService.getUserRatings(userInfo, pageOptionsDto);
  }

  @Put('/user/ratings/:movieId')
  @ApiOperation({ summary: 'Update movie rating' })
  @ApiBearerAuth()
  async updateRating(
    @Param('movieId') movieId: string,
    @Body() rateMovieDto: RateMovieDto,
    @AuthUser() userInfo: UserInfoDto,
  ) {
    return this.ratingService.updateRating(movieId, userInfo, rateMovieDto);
  }

  @Delete('/user/ratings/:movieId')
  @ApiOperation({ summary: 'Delete movie rating' })
  @ApiBearerAuth()
  async deleteRating(
    @Param('movieId') movieId: string,
    @AuthUser() userInfo: UserInfoDto,
  ) {
    return this.ratingService.deleteRating(movieId, userInfo);
  }
}
