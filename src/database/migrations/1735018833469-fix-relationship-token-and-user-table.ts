import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class FixRelationshipTokenAndUserTable1735018833469
  implements MigrationInterface
{
  name = 'FixRelationshipTokenAndUserTable1735018833469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN "user_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "user_id" uuid NOT NULL`,
    );
  }
}
