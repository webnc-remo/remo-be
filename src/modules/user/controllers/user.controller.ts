import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
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
import { ProfileResponseDto } from '../domains/dtos/responses/profile.dto';
import { UserInfoDto } from '../domains/dtos/user-info.dto';
import { IUserService } from '../services/user.service';

@Controller('/v1/user')
@ApiTags('user')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user profile' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiBearerAuth()
  async getProfile(
    @AuthUser() userInfo: UserInfoDto,
  ): Promise<ProfileResponseDto> {
    const user: ProfileResponseDto = await this.userService.getUserProfile(
      userInfo.id,
    );

    return user;
  }

  @Get('fav/:tmdbId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add movie to favorite list' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie added to favorite list',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiBearerAuth()
  async addFavorite(
    @AuthUser() userInfo: UserInfoDto,
    @Param('tmdbId') tmdbId: string,
  ) {
    return this.userService.addFavorite(userInfo.id, tmdbId);
  }
}
