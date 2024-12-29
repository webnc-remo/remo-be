import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { MoviesService } from '../../movie/services/movie.service';
import { RateMovieDto } from '../domains/dtos/rate-movie.dto';
import { UserInfoDto } from '../domains/dtos/user-info.dto';
import { RatingEntity } from '../domains/entities/rating.entity';
import { RatingRepository } from '../repository/rating.repository';

@Injectable()
export class RatingService {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly moviesService: MoviesService,
  ) {}

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

    const rating = await this.ratingRepository.createRating(
      userInfo.id,
      movieId,
      rateMovieDto.rating,
      rateMovieDto.review,
    );

    await this.moviesService.addMovieRating(
      Number(movieId),
      rateMovieDto.rating,
    );

    return rating;
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

    await this.ratingRepository.updateRating(
      userInfo.id,
      movieId,
      rateMovieDto.rating,
      rateMovieDto.review,
    );

    await this.moviesService.updateMovieRating(
      Number(movieId),
      existingRating.rating,
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
