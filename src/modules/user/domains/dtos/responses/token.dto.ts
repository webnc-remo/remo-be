import { type UserResponseDto } from './user-response.dto';

export class TokenPayload {
  accessToken!: string;

  user!: UserResponseDto;
}
