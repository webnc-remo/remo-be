import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email to send reset password link',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'newPassword123',
    description: 'New password',
  })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}
