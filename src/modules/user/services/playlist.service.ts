import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UpdatePlaylistDto } from '../domains/dtos/update-playlist.dto';
import { UserMovieListEntity } from '../domains/entities/user-movie-list.entity';
import { PlaylistRepository } from '../repository/playlist.repository';

@Injectable()
export class PlaylistService {
  constructor(private readonly playlistRepository: PlaylistRepository) {}

  async createPlaylist(
    userId: string,
    dto: UpdatePlaylistDto,
  ): Promise<UserMovieListEntity> {
    return this.playlistRepository.createPlaylist(userId, dto);
  }

  async addMovieToPlaylist(
    userId: string,
    playlistId: string,
    tmdbId: string,
  ): Promise<void> {
    const playlist = await this.playlistRepository.findPlaylistById(
      playlistId,
      userId,
    );

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    const existingMovie = await this.playlistRepository.findMovieInPlaylist(
      playlistId,
      tmdbId,
    );

    if (existingMovie) {
      throw new ConflictException('Movie already exists in playlist');
    }

    await this.playlistRepository.createPlaylistItem(playlistId, tmdbId);
  }

  async updatePlaylist(
    userId: string,
    playlistId: string,
    dto: UpdatePlaylistDto,
  ): Promise<UserMovieListEntity> {
    const playlist = await this.playlistRepository.findPlaylistById(
      playlistId,
      userId,
    );

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    Object.assign(playlist, dto);

    return this.playlistRepository.updatePlaylist(playlist);
  }

  async deletePlaylist(userId: string, playlistId: string): Promise<void> {
    const playlist = await this.playlistRepository.findPlaylistById(
      playlistId,
      userId,
    );

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    await this.playlistRepository.deletePlaylist(playlist);
  }

  async getPlaylistDetails(
    userId: string,
    playlistId: string,
  ): Promise<UserMovieListEntity> {
    const playlist = await this.playlistRepository.findPlaylistWithItems(
      playlistId,
      userId,
    );

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    return playlist;
  }

  async getUserPlaylists(userId: string): Promise<UserMovieListEntity[]> {
    return this.playlistRepository.getUserPlaylists(userId);
  }
}
