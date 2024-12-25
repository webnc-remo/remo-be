import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../../../common/page-meta.dto';
import { MovieEntity } from '../../../../movie/domains/schemas/movie.schema';

export class ListUserInfoDto {
  @ApiProperty()
  fullname!: string;
}

export class ListInfoDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  listName!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ type: ListUserInfoDto })
  user!: ListUserInfoDto;
}

export class ListMoviesResponseDto {
  @ApiProperty({ type: [MovieEntity] })
  items!: MovieEntity[];

  @ApiProperty({ type: ListInfoDto })
  list!: ListInfoDto;

  @ApiProperty({ type: PageMetaDto })
  meta!: PageMetaDto;
}
