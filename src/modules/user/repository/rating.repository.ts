import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async getUserRatings(userId: string) {
    return this.ratingRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async createRating(
    userId: string,
    movieId: string,
    rating: number,
  ): Promise<RatingEntity> {
    const newRating = this.ratingRepository.create({
      user: { id: userId },
      tmdb_id: movieId,
      rating,
    });

    return this.ratingRepository.save(newRating);
  }

  async updateRating(userId: string, movieId: string, rating: number) {
    await this.ratingRepository.update(
      { user: { id: userId }, tmdb_id: movieId },
      { rating },
    );

    return this.findUserRating(userId, movieId);
  }

  async deleteRating(userId: string, movieId: string): Promise<void> {
    await this.ratingRepository.delete({
      user: { id: userId },
      tmdb_id: movieId,
    });
  }
}
