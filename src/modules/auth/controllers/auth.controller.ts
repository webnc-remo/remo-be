import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { PublicRoute } from '../../../decorators';
import { RegisterRequestDto } from '../domains/dtos/requests/register.dto';
import { IAuthService } from '../services/auth.service';

@Controller('/api/v1/auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService,
  ) {}

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
  async register(
    @Body() registerRequestDto: RegisterRequestDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.handleRegister(registerRequestDto);

      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json(error);
    }
  }
}
