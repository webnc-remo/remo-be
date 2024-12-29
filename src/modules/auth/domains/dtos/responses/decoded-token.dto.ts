import { ApiProperty } from '@nestjs/swagger';

export class DecodedTokenDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty()
  avatar!: string;

  @ApiProperty()
  role!: string;

  @ApiProperty()
  isVerified!: boolean;

  @ApiProperty()
  iat!: number;

  @ApiProperty()
  exp!: number;
}
