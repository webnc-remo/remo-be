import { type UserInfoDto } from '../../../../user/domains/dtos/user-info.dto';

export class TokenPayloadResponseDto {
  accessToken!: string;

  refreshToken!: string;

  user!: UserInfoDto;
}
