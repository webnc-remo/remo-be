import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    example: '123456',
    description: 'The 6-digit verification code sent to your email',
  })
  @IsString()
  @Length(6, 6, { message: 'Code must be exactly 6 characters' })
  code!: string;
}
