import { ApiProperty } from '@nestjs/swagger';

export class DecodedToken {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  iat!: number;

  @ApiProperty()
  exp!: number;
}
