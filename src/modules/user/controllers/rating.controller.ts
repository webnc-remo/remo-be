import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthUser } from '../../../decorators';
import { RateMovieDto } from '../domains/dtos/rate-movie.dto';
import { UserInfoDto } from '../domains/dtos/user-info.dto';
import { RatingService } from '../services/rating.service';

@ApiTags('User Movie Ratings')
@Controller('ratings')
@ApiBearerAuth()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post(':movieId')
  @ApiOperation({ summary: 'Rate a movie' })
  async rateMovie(
    @Param('movieId') movieId: string,
    @Body() rateMovieDto: RateMovieDto,
    @AuthUser() userInfo: UserInfoDto,
  ) {
    return this.ratingService.rateMovie(movieId, userInfo, rateMovieDto);
  }

  @Get('movie/:movieId')
  @ApiOperation({ summary: 'Get user rating for a specific movie' })
  async getUserMovieRating(
    @Param('movieId') movieId: string,
    @AuthUser() userInfo: UserInfoDto,
  ) {
    return this.ratingService.getUserMovieRating(movieId, userInfo);
  }

  @Get('user')
  @ApiOperation({ summary: 'Get all ratings by current user' })
  async getUserRatings(@AuthUser() userInfo: UserInfoDto) {
    return this.ratingService.getUserRatings(userInfo);
  }

  @Put(':movieId')
  @ApiOperation({ summary: 'Update movie rating' })
  async updateRating(
    @Param('movieId') movieId: string,
    @Body() rateMovieDto: RateMovieDto,
    @AuthUser() userInfo: UserInfoDto,
  ) {
    return this.ratingService.updateRating(movieId, userInfo, rateMovieDto);
  }

  @Delete(':movieId')
  @ApiOperation({ summary: 'Delete movie rating' })
  async deleteRating(
    @Param('movieId') movieId: string,
    @AuthUser() userInfo: UserInfoDto,
  ) {
    return this.ratingService.deleteRating(movieId, userInfo);
  }
}
