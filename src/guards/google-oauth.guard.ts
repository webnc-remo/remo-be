import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  public logger: Logger;

  constructor() {
    super();
    this.logger = new Logger(GoogleOauthGuard.name);
  }

  handleRequest<UserInfoDto>(
    err,
    user: UserInfoDto,
    _info,
    _context: ExecutionContext,
  ): UserInfoDto {
    if (err || !user) {
      this.logger.error(err);
    }

    return user;
  }
}
