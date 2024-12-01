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
import { TokenBody } from '../domains/dtos/requests/token.dto';
import { UserRequest } from '../domains/dtos/requests/user.dto';
import { LogOutResponse } from '../domains/dtos/responses/logout.dto';
import { ProfileResponse } from '../domains/dtos/responses/profile.dto';
import { TokenEntity } from '../domains/entities/token.entity';
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

  @Post('/register')
  @ApiOperation({ summary: 'Register' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Register success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Register failed',
  })
  @PublicRoute(true)
  async register(@Body() userRequest: UserRequest, @Res() res: Response) {
    try {
      const user = await this.userService.handleRegister(userRequest);

      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json(error);
    }
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Logout' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Logout success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Logout failed',
  })
  @PublicRoute(true)
  async logout(@Body() token: TokenBody, @Res() res: Response) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const removedToken: TokenEntity =
        await this.userService.handleLogout(token);

      const logOutResponse: LogOutResponse = {
        message: 'Logged out',
        userId: removedToken.userId,
      };

      return res.status(HttpStatus.CREATED).json(logOutResponse);
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
