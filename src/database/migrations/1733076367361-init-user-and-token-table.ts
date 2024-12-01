import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class InitUserAndTokenTable1733076367361 implements MigrationInterface {
  name = 'InitUserAndTokenTable1733076367361';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying,
                "avatar" character varying,
                "password" character varying,
                "social_provider" character varying,
                "social_provider_id" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "refresh_tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "token" character varying NOT NULL,
                "iat" TIMESTAMP NOT NULL,
                "exp" TIMESTAMP NOT NULL,
                "user_id_id" uuid,
                CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "refresh_tokens" 
            ADD CONSTRAINT "FK_a6b88c09805e6443e3af78c2111" 
            FOREIGN KEY ("user_id_id") 
            REFERENCES "users"("id") 
            ON DELETE NO ACTION 
            ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_a6b88c09805e6443e3af78c2111"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
