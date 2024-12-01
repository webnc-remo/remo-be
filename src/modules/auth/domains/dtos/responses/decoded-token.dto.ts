import { ApiProperty } from '@nestjs/swagger';

export class DecodedTokenDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  iat!: number;

  @ApiProperty()
  exp!: number;
}
