import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import { GoogleAccount } from '../../../../modules/auth/domains/dtos/requests/google.dto';
import { IUserService } from '../../../../modules/user/services/user.service';
import { UserInfoDto } from '../../../user/domains/dtos/user-info.dto';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    @Inject('IUserService')
    public readonly userService: IUserService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      clientID: configService.get<string>('CLIENT_ID'),
      clientSecret: configService.get<string>('CLIENT_SECRET'),
      callbackURL: configService.get<string>('REDIRECT_URI'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const googleObj = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      email: profile._json.email ?? '',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      avatar: profile._json.picture ?? '',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      fullName: profile._json.name ?? '',
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const googleAccount = new GoogleAccount(googleObj.email, googleObj.avatar);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    let user = await this.userService.getUserByEmail(googleObj.email);

    if (!user) {
      user = await this.userService.createUserWithGoogleLogin(googleAccount);
    }

    const userInfo: UserInfoDto = {
      id: user?.id ?? '',
      email: user?.email ?? '',
      fullName: user?.fullName ?? '',
      avatar: user?.avatar ?? '',
    };

    return userInfo;
  }
}
