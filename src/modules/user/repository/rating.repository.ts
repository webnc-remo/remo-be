import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PageOptionsDto } from '../../../common/page-options.dto';
import { RatingEntity } from '../domains/entities/rating.entity';

@Injectable()
export class RatingRepository {
  constructor(
    @InjectRepository(RatingEntity, 'postgresConnection')
    private readonly ratingRepository: Repository<RatingEntity>,
  ) {}

  async findUserRating(userId: string, movieId: string) {
    return this.ratingRepository.findOne({
      where: { user: { id: userId }, tmdb_id: movieId },
    });
  }

  async getUserRatings(userId: string, pageOptionsDto: PageOptionsDto) {
    return this.ratingRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
  }

  async createRating(
    userId: string,
    movieId: string,
    rating: number,
    review?: string,
  ): Promise<RatingEntity> {
    const newRating = this.ratingRepository.create({
      user: { id: userId },
      tmdb_id: movieId,
      rating,
      review,
    });

    return this.ratingRepository.save(newRating);
  }

  async updateRating(
    userId: string,
    movieId: string,
    rating: number,
    review?: string,
  ) {
    await this.ratingRepository.update(
      { user: { id: userId }, tmdb_id: movieId },
      { rating, review },
    );

    return this.findUserRating(userId, movieId);
  }

  async deleteRating(userId: string, movieId: string): Promise<void> {
    await this.ratingRepository.delete({
      user: { id: userId },
      tmdb_id: movieId,
    });
  }

  async getAllUserRatingByMovieId(movieId: string) {
    return this.ratingRepository.find({
      where: { tmdb_id: movieId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
      select: {
        user: {
          id: true,
          email: true,
          fullName: true,
          avatar: true,
        },
        id: true,
        rating: true,
        review: true,
        createdAt: true,
      },
    });
  }
}
