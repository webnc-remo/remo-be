import { type UserResponse } from './user-response.dto';

export class TokenPayload {
  accessToken!: string;

  user!: UserResponse;
}
