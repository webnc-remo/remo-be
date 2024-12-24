import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddConstrainNotNullForUserMovieListItems1735029158523
  implements MigrationInterface
{
  name = 'AddConstrainNotNullForUserMovieListItems1735029158523';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_movie_list_items" ALTER COLUMN "tmdb_id" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_movie_list_items" ALTER COLUMN "tmdb_id" SET NOT NULL`,
    );
  }
}
