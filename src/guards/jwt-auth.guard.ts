import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { PUBLIC_ROUTE_KEY } from '../decorators/index';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_ROUTE_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest<Request>();

    if (isPublic) {
      const authHeader = request.headers.authorization;

      if (authHeader?.startsWith('Bearer ')) {
        return super.canActivate(context);
      }

      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<UserInfoDto>(
    err,
    user,
    _info,
    _context: ExecutionContext,
  ): UserInfoDto {
    if (err || !user) {
      throw err || new UnauthorizedException('Access Token is Invalid');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // except for /v1/auth/verify-email, v1/auth/logout
    if (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (!user.isVerified &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        !_context
          .switchToHttp()
          .getRequest()
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          .path.includes('/v1/auth/verify-email')) ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      _context
        .switchToHttp()
        .getRequest()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .path.includes('/v1/auth/logout')
    ) {
      throw new ForbiddenException(
        'Please verify your email before accessing this resource',
      );
    }

    const responseUser: UserInfoDto = user as UserInfoDto;

    return responseUser;
  }
}
