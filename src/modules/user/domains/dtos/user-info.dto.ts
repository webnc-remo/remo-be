import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { EmailFieldOptional } from '../../../../decorators';

export class UserInfoDto {
  @ApiProperty({
    example: 'b0535d19-a172-4f66-acff-ce6b28c369d2',
    description: 'User id',
  })
  @IsUUID('4', { message: 'Invalid UUID' })
  id!: string;

  @ApiProperty({
    example: 'tantran.300803@gmail.com',
    description: 'User email',
  })
  @EmailFieldOptional({ nullable: true })
  email?: string | null;

  @ApiProperty({
    example: 'Tan Tran',
    description: 'User name',
  })
  fullName?: string | null;

  @ApiProperty({
    example: 'https://google.com/avatar.jpg',
    description: 'User avatar',
  })
  avatar?: string | null;
}
