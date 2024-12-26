import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class ChangeRatingFromStringToNumber1735230732937
  implements MigrationInterface
{
  name = 'ChangeRatingFromStringToNumber1735230732937';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ratings" DROP COLUMN "rating"`);
    await queryRunner.query(
      `ALTER TABLE "ratings" ADD "rating" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ratings" DROP COLUMN "rating"`);
    await queryRunner.query(
      `ALTER TABLE "ratings" ADD "rating" character varying NOT NULL`,
    );
  }
}
