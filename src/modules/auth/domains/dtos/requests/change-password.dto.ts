import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'oldPassword123',
    description: 'Current password',
  })
  @IsString()
  @MinLength(6)
  oldPassword!: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'New password',
  })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}
