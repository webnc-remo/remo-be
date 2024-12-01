import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  async register(@Body() registerRequestDto: RegisterRequestDto) {
    const user = await this.authService.handleRegister(registerRequestDto);

    return user;
  }
}
