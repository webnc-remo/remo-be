import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class FixRelationshipTokenAndUserTable21735020366091
  implements MigrationInterface
{
  name = 'FixRelationshipTokenAndUserTable21735020366091';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_a6b88c09805e6443e3af78c2111"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" RENAME COLUMN "user_id_id" TO "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" RENAME COLUMN "user_id" TO "user_id_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_a6b88c09805e6443e3af78c2111" 
      FOREIGN KEY ("user_id_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
