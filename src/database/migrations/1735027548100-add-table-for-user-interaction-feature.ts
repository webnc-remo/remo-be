import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddTableForUserInteractionFeature1735027548100
  implements MigrationInterface
{
  name = 'AddTableForUserInteractionFeature1735027548100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ratings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "rating" character varying NOT NULL,
        "review" character varying,
        "tmdb_id" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" uuid,
        CONSTRAINT "PK_0f31425b073219379545ad68ed9" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "user_movie_list_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tmdb_id" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "list_id" uuid,
        CONSTRAINT "PK_b3518351682a491f306219a72a8" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "user_movie_lists" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "list_name" character varying NOT NULL,
        "description" character varying,
        "image_url" character varying,
        "list_type" character varying NOT NULL
 DEFAULT 'custom',
        "is_public" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" uuid,
        CONSTRAINT "PK_d7889f316511fbc9ef9b38584a0" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `ALTER TABLE "ratings" ADD CONSTRAINT "FK_f49ef8d0914a14decddbb170f2f"
       FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "user_movie_list_items" ADD CONSTRAINT "FK_6b9f189b5bba52c9e7fbf5cdb88"
       FOREIGN KEY ("list_id") REFERENCES "user_movie_lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "user_movie_lists" ADD CONSTRAINT "FK_0ae2f9d8f2ee8125bd439a1dc42"
       FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_movie_lists" DROP CONSTRAINT "FK_0ae2f9d8f2ee8125bd439a1dc42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_movie_list_items" DROP CONSTRAINT "FK_6b9f189b5bba52c9e7fbf5cdb88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ratings" DROP CONSTRAINT "FK_f49ef8d0914a14decddbb170f2f"`,
    );
    await queryRunner.query(`DROP TABLE "user_movie_lists"`);
    await queryRunner.query(`DROP TABLE "user_movie_list_items"`);
    await queryRunner.query(`DROP TABLE "ratings"`);
  }
}
