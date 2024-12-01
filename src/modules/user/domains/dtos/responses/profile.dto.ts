import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponse {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  avatar!: string;

  @ApiProperty()
  createdAt!: Date;
}
