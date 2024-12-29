import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class RateMovieDto {
  @ApiProperty({
    description: 'Rating value from 0 to 100',
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  rating!: number;

  @ApiProperty({
    description: 'Review of the movie',
  })
  @IsString()
  @IsOptional()
  review?: string;
}
