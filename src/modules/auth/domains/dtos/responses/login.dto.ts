import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

import { UserInfoDto } from '../../../../user/domains/dtos/user-info.dto';

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    description: 'User access token',
  })
  @IsString()
  accessToken!: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    description: 'User refresh token',
  })
  @IsString()
  refreshToken!: string;

  @Type(() => UserInfoDto)
  user!: UserInfoDto;
}
