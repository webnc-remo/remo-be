import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddFullnameAttributeInUserTable1733158918208
  implements MigrationInterface
{
  name = 'AddFullnameAttributeInUserTable1733158918208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "social_provider_id" TO "full_name"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "full_name" TO "social_provider_id"`,
    );
  }
}
