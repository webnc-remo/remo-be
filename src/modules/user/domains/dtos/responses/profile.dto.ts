import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  avatar!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty()
  createdAt!: Date;
}
