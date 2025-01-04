import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PageOptionsDto } from '../../../common/page-options.dto';
import { MoviesService } from '../../movie/services/movie.service';
import { UpdatePlaylistDto } from '../domains/dtos/update-playlist.dto';
import { UserInfoDto } from '../domains/dtos/user-info.dto';
import { UserMovieListEntity } from '../domains/entities/user-movie-list.entity';
import { PlaylistRepository } from '../repository/playlist.repository';
import { UserFavMoviesRepository } from '../repository/user-movie-fav.repository';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly playlistRepository: PlaylistRepository,
    private readonly moviesService: MoviesService,
    private readonly userFavMoviesRepository: UserFavMoviesRepository,
  ) {}

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
    userInfo: UserInfoDto,
    playlistId: string,
    pageOptionsDto: PageOptionsDto,
  ) {
    const playlist = await this.playlistRepository.findPlaylistWithItems(
      playlistId,
      userInfo.id,
    );

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    const movieIds = await this.userFavMoviesRepository.getMovieIdsFromList(
      playlist.id,
    );

    const movies = await this.moviesService.getMoviesByIds(
      movieIds,
      pageOptionsDto,
    );

    return {
      items: movies.items,
      list: {
        id: playlist.id,
        listName: playlist.listName,
        createdAt: playlist.createdAt,
        user: {
          fullname: userInfo.fullName as string,
          email: userInfo.email as string,
        },
      },
      meta: movies.meta,
    };
  }

  async getUserPlaylists(userId: string): Promise<UserMovieListEntity[]> {
    return this.playlistRepository.getUserPlaylists(userId);
  }

  async getPlaylistsByMovieId(userId: string, tmdbId: string) {
    const playlists = await this.playlistRepository.findPlaylistsByMovieId(
      userId,
      tmdbId,
    );

    return {
      playlists: playlists.map((playlist) => ({
        id: playlist.id,
        listName: playlist.listName,
        description: playlist.description,
        imageUrl: playlist.imageUrl,
        listType: playlist.listType,
        isPublic: playlist.isPublic,
        createdAt: playlist.createdAt,
      })),
    };
  }

  async removeMovieFromPlaylist(
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

    const movieInPlaylist = await this.playlistRepository.findMovieInPlaylist(
      playlistId,
      tmdbId,
    );

    if (!movieInPlaylist) {
      throw new NotFoundException('Movie not found in playlist');
    }

    await this.playlistRepository.deletePlaylistItem(playlistId, tmdbId);
  }
}
