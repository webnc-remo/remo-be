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
import { AddMovieToPlaylistDto } from '../domains/dtos/add-movie-to-playlist.dto';
import { UpdatePlaylistDto } from '../domains/dtos/update-playlist.dto';
import { UserInfoDto } from '../domains/dtos/user-info.dto';
import { PlaylistService } from '../services/playlist.service';

@Controller('playlists')
@ApiTags('user-playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new playlist' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Playlist created successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiBearerAuth()
  async createPlaylist(
    @AuthUser() userInfo: UserInfoDto,
    @Body() createPlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistService.createPlaylist(userInfo.id, createPlaylistDto);
  }

  @Post(':playlistId/movies')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add movie to playlist' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Movie added to playlist',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiBearerAuth()
  async addMovieToPlaylist(
    @AuthUser() userInfo: UserInfoDto,
    @Param('playlistId') playlistId: string,
    @Body() dto: AddMovieToPlaylistDto,
  ) {
    await this.playlistService.addMovieToPlaylist(
      userInfo.id,
      playlistId,
      dto.tmdbId,
    );
  }

  @Put(':playlistId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update playlist' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Playlist updated successfully',
  })
  @ApiBearerAuth()
  async updatePlaylist(
    @AuthUser() userInfo: UserInfoDto,
    @Param('playlistId') playlistId: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistService.updatePlaylist(
      userInfo.id,
      playlistId,
      updatePlaylistDto,
    );
  }

  @Delete(':playlistId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete playlist' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Playlist deleted successfully',
  })
  @ApiBearerAuth()
  async deletePlaylist(
    @AuthUser() userInfo: UserInfoDto,
    @Param('playlistId') playlistId: string,
  ) {
    await this.playlistService.deletePlaylist(userInfo.id, playlistId);
  }

  @Get(':playlistId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get playlist details' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Playlist details retrieved successfully',
  })
  @ApiBearerAuth()
  async getPlaylistDetails(
    @AuthUser() userInfo: UserInfoDto,
    @Param('playlistId') playlistId: string,
  ) {
    return this.playlistService.getPlaylistDetails(userInfo.id, playlistId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user playlists' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User playlists retrieved successfully',
  })
  @ApiBearerAuth()
  async getUserPlaylists(@AuthUser() userInfo: UserInfoDto) {
    return this.playlistService.getUserPlaylists(userInfo.id);
  }
}
