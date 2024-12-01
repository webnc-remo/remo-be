import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class InitUserAndTokenTable1733071780685 implements MigrationInterface {
  name = 'InitUserAndTokenTable1733071780685';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying,
        "avatar" character varying,
        "password" character varying,
        "social_provider" character varying NOT NULL,
        "social_providerd" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "token" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "token" character varying NOT NULL,
        "refresh_token" character varying NOT NULL,
        "iat" TIMESTAMP NOT NULL,
        "exp" TIMESTAMP NOT NULL,
        "user_id_id" uuid,
        CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `ALTER TABLE "token" 
        ADD CONSTRAINT "FK_671bd2b295bff0302f300b0634b" 
        FOREIGN KEY ("user_id_id") 
        REFERENCES "users"("id") 
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "FK_671bd2b295bff0302f300b0634b"`,
    );
    await queryRunner.query(`DROP TABLE "token"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
