import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddVerificationCodesTable1735491490744
  implements MigrationInterface
{
  name = 'AddVerificationCodesTable1735491490744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "verification_codes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "code" character varying(6) NOT NULL,
        "expires_at" TIMESTAMP NOT NULL,
        "user_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" uuid,
        CONSTRAINT "REL_9a854eeb4598a22d554ecfe6e8" UNIQUE ("userId"),
        CONSTRAINT "PK_18741b6b8bf1680dbf5057421d7" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `ALTER TABLE "verification_codes"
       ADD CONSTRAINT "FK_9a854eeb4598a22d554ecfe6e81"
       FOREIGN KEY ("userId")
       REFERENCES "users"("id")
       ON DELETE NO ACTION
       ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verification_codes"
       DROP CONSTRAINT "FK_9a854eeb4598a22d554ecfe6e81"`,
    );
    await queryRunner.query(`DROP TABLE "verification_codes"`);
  }
}
