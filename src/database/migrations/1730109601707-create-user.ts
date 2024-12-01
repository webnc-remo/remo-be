import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateUser1730109601707 implements MigrationInterface {
  name = 'CreateUser1730109601707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE "users" 
            (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "email" character varying, 
                "password" character varying, 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), 
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )`,
    );
    await queryRunner.query(
      `
            CREATE TABLE "refresh_tokens" 
            (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "user_id" character varying NOT NULL, 
                "token" character varying NOT NULL, 
                "iat" TIMESTAMP NOT NULL, 
                "exp" TIMESTAMP NOT NULL, 
                CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")
            )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
