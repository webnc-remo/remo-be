import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({ example: 'Logout successfully' })
  message!: string;

  @ApiProperty({ example: '6159fb66-2769-4110-99d5-6c68d07497d0' })
  userId!: string;
}

export class RenewTokenResponseDto {
  message!: string;
}
