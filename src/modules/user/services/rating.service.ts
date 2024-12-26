import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RateMovieDto } from '../domains/dtos/rate-movie.dto';
import { UserInfoDto } from '../domains/dtos/user-info.dto';
import { RatingEntity } from '../domains/entities/rating.entity';
import { RatingRepository } from '../repository/rating.repository';

@Injectable()
export class RatingService {
  constructor(private readonly ratingRepository: RatingRepository) {}

  async rateMovie(
    movieId: string,
    userInfo: UserInfoDto,
    rateMovieDto: RateMovieDto,
  ): Promise<RatingEntity> {
    const existingRating = await this.ratingRepository.findUserRating(
      userInfo.id,
      movieId.toString(),
    );

    if (existingRating) {
      throw new BadRequestException(
        'Rating already exists for this movie. Use update endpoint instead.',
      );
    }

    return this.ratingRepository.createRating(
      userInfo.id,
      movieId,
      rateMovieDto.rating,
    );
  }

  async getUserMovieRating(
    movieId: string,
    userInfo: UserInfoDto,
  ): Promise<RatingEntity> {
    const rating = await this.ratingRepository.findUserRating(
      userInfo.id,
      movieId,
    );

    if (!rating) {
      throw new NotFoundException('Rating not found for this movie');
    }

    return rating;
  }

  async getUserRatings(userInfo: UserInfoDto): Promise<RatingEntity[]> {
    return this.ratingRepository.getUserRatings(userInfo.id);
  }

  async updateRating(
    movieId: string,
    userInfo: UserInfoDto,
    rateMovieDto: RateMovieDto,
  ) {
    const existingRating = await this.ratingRepository.findUserRating(
      userInfo.id,
      movieId,
    );

    if (!existingRating) {
      throw new NotFoundException('Rating not found for this movie');
    }

    return this.ratingRepository.updateRating(
      userInfo.id,
      movieId,
      rateMovieDto.rating,
    );
  }

  async deleteRating(movieId: string, userInfo: UserInfoDto): Promise<void> {
    const rating = await this.ratingRepository.findUserRating(
      userInfo.id,
      movieId,
    );

    if (!rating) {
      throw new NotFoundException('Rating not found for this movie');
    }

    await this.ratingRepository.deleteRating(userInfo.id, movieId);
  }
}
