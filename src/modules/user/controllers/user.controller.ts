/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { PublicRoute } from '../../../decorators';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { UserRequest } from '../domains/dtos/requests/user.dto';
import { ProfileResponse } from '../domains/dtos/responses/profile.dto';
import { IUserService } from '../services/user.service';

@Controller('/user')
@ApiTags('user')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Login success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Login failed',
  })
  @PublicRoute(true)
  async login(@Body() user: UserRequest, @Res() res: Response) {
    try {
      const tokenPayload = await this.userService.handleLogin(user);

      return res.status(HttpStatus.CREATED).json(tokenPayload);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json(error);
    }
  }

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
  async getProfile(@Param('id') userId: string, @Res() res: Response) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const user: ProfileResponse =
        await this.userService.getUserProfile(userId);

      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json(error);
    }
  }
}
