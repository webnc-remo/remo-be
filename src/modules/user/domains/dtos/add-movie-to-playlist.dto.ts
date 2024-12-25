import { IsNotEmpty, IsString } from 'class-validator';

export class AddMovieToPlaylistDto {
  @IsString()
  @IsNotEmpty()
  tmdbId!: string;
}
