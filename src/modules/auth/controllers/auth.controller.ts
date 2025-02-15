import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { UserRole } from '../../../constants';
import { AuthUser, PublicRoute } from '../../../decorators';
import { Roles } from '../../../decorators/roles.decorator';
import { GoogleOauthGuard } from '../../../guards/google-oauth.guard';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { UserInfoDto } from '../../user/domains/dtos/user-info.dto';
import { ChangePasswordDto } from '../domains/dtos/requests/change-password.dto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../domains/dtos/requests/forgot-password.dto';
import { LoginRequestDto } from '../domains/dtos/requests/login.dto';
import { RefreshTokenRequestDto } from '../domains/dtos/requests/refresh-token.dto';
import { RegisterRequestDto } from '../domains/dtos/requests/register.dto';
import { VerifyEmailDto } from '../domains/dtos/requests/verify-email.dto';
import { IAuthService } from '../services/auth.service';

@Controller('/v1/auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
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
  async login(@Body() loginRequestDto: LoginRequestDto) {
    const user = await this.authService.handleLogin(loginRequestDto);

    return user;
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Logout' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Logout successfully',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Logout failed',
  })
  @ApiBearerAuth()
  async logout(
    @AuthUser() user: UserInfoDto,
    @Body() token: RefreshTokenRequestDto,
  ) {
    const removedToken = await this.authService.handleLogout(user, token);

    return removedToken;
  }

  @Get('/google')
  @ApiOperation({ summary: 'Login with Google' })
  @HttpCode(HttpStatus.CREATED)
  @PublicRoute(true)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Login with OAuth Google successfully',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Login with OAuth Google failed',
  })
  @UseGuards(GoogleOauthGuard)
  @PublicRoute(true)
  async googleLogin(@Req() req: Request, @Res() res: Response) {
    const clientHost = `${this.configService.get<string>('CLIENT_HOST')}`;

    const { error } = req.query as { error?: string };

    if (error) {
      return res.redirect(`${clientHost}/login`);
    }

    const userInfoDto = req.user as UserInfoDto;

    const loginDto = await this.authService.handleGoogleLogin(userInfoDto);

    const redirectUrl =
      `${clientHost}/` +
      `login/?access_token=${loginDto?.accessToken}&refresh_token=${loginDto?.refreshToken}`;

    return res.redirect(redirectUrl);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Get new access token' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Get new access token successfully',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Get new access token failed',
  })
  @PublicRoute(true)
  async renewToken(@Body() token: RefreshTokenRequestDto) {
    const newPairToken = await this.authService.renewToken(token);

    return newPairToken;
  }

  @Get('admin/hello')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin only endpoint' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Hello from admin endpoint',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User is not an admin',
  })
  @ApiBearerAuth()
  adminOnlyEndpoint() {
    return { message: 'Hello World! This is admin only endpoint.' };
  }

  @Post('verify-email')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Verify email with code' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid or expired verification code',
  })
  @ApiBearerAuth()
  async verifyEmail(
    @AuthUser() user: UserInfoDto,
    @Body() verifyEmailDto: VerifyEmailDto,
  ) {
    return this.authService.verifyEmail(user, verifyEmailDto.code);
  }

  @Post('resend-verification')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Resend verification code' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verification code resent successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User is already verified or too many requests',
  })
  @ApiBearerAuth()
  async resendVerificationCode(@AuthUser() user: UserInfoDto) {
    return this.authService.resendVerificationCode(user);
  }

  @Post('forgot-password')
  @PublicRoute(true)
  @ApiOperation({ summary: 'Request password reset link' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reset link sent successfully',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.handleForgotPassword(forgotPasswordDto.email);
  }

  @Get('reset-password')
  @PublicRoute(true)
  @ApiOperation({ summary: 'Verify reset password token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token is valid',
  })
  verifyResetToken(@Query('token') token: string) {
    return this.authService.verifyResetToken(token);
  }

  @Post('reset-password')
  @PublicRoute(true)
  @ApiOperation({ summary: 'Reset password with token' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successfully',
  })
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.handleResetPassword(
      token,
      resetPasswordDto.newPassword,
    );
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change password' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password changed successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Current password is incorrect',
  })
  @ApiBearerAuth()
  async changePassword(
    @AuthUser() user: UserInfoDto,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      user.id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }
}
