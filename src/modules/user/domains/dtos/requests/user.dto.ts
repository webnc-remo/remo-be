import { ApiProperty } from '@nestjs/swagger';

import {
  EmailFieldOptional,
  StringFieldOptional,
} from '../../../../../decorators';

export class UserRequest {
  @ApiProperty({
    example: 'tantran.300803@gmail.com',
    description: 'User email',
  })
  @EmailFieldOptional({ nullable: true })
  email?: string | null;

  @ApiProperty({
    example: '123456',
    description: 'User password',
  })
  @StringFieldOptional({ nullable: true })
  password?: string | null;
}
