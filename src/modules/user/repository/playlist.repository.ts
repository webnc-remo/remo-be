import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdatePlaylistDto } from '../domains/dtos/update-playlist.dto';
import { UserMovieListEntity } from '../domains/entities/user-movie-list.entity';
import { UserMovieListItemEntity } from '../domains/entities/user-movie-list-item.entity';

@Injectable()
export class PlaylistRepository {
  constructor(
    @InjectRepository(UserMovieListEntity, 'postgresConnection')
    private readonly playlistRepository: Repository<UserMovieListEntity>,
    @InjectRepository(UserMovieListItemEntity, 'postgresConnection')
    private readonly playlistItemRepository: Repository<UserMovieListItemEntity>,
  ) {}

  async createPlaylist(
    userId: string,
    dto: UpdatePlaylistDto,
  ): Promise<UserMovieListEntity> {
    const playlist = this.playlistRepository.create({
      ...dto,
      user: { id: userId },
      listType: 'custom',
      isPublic: true,
    });

    return this.playlistRepository.save(playlist);
  }

  async findPlaylistById(
    playlistId: string,
    userId: string,
  ): Promise<UserMovieListEntity | null> {
    return this.playlistRepository.findOne({
      where: {
        id: playlistId,
        user: { id: userId },
      },
    });
  }

  async findPlaylistWithItems(
    playlistId: string,
    userId: string,
  ): Promise<UserMovieListEntity | null> {
    return this.playlistRepository.findOne({
      where: {
        id: playlistId,
        user: { id: userId },
      },
      relations: ['items'],
    });
  }

  async findMovieInPlaylist(
    playlistId: string,
    tmdbId: string,
  ): Promise<UserMovieListItemEntity | null> {
    return this.playlistItemRepository.findOne({
      where: {
        list: { id: playlistId },
        tmdb_id: tmdbId,
      },
    });
  }

  async createPlaylistItem(
    playlistId: string,
    tmdbId: string,
  ): Promise<UserMovieListItemEntity> {
    const playlistItem = this.playlistItemRepository.create({
      list: { id: playlistId },
      tmdb_id: tmdbId,
    });

    return this.playlistItemRepository.save(playlistItem);
  }

  async updatePlaylist(
    playlist: UserMovieListEntity,
  ): Promise<UserMovieListEntity> {
    return this.playlistRepository.save(playlist);
  }

  async deletePlaylist(playlist: UserMovieListEntity): Promise<void> {
    await this.playlistRepository.remove(playlist);
  }

  async getUserPlaylists(userId: string): Promise<UserMovieListEntity[]> {
    return this.playlistRepository.find({
      where: {
        user: { id: userId },
        listType: 'custom',
      },
      relations: ['items'],
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
