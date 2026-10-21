import { MigrationInterface, QueryRunner } from 'typeorm';

export class UndoAuth1792600409068 implements MigrationInterface {
  name = 'UndoAuth1792600409068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "upload_files" DROP CONSTRAINT "FK_upload_files_user"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_upload_files_user_type"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "occupation"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "education"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_b99e81ce30707d29775c3ae2d8" ON "upload_files"  ("user_id", "type") `,
    );
    await queryRunner.query(
      `ALTER TABLE "upload_files" ADD CONSTRAINT "FK_495132b2a69e417d2f6292f19e1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "upload_files" DROP CONSTRAINT "FK_495132b2a69e417d2f6292f19e1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b99e81ce30707d29775c3ae2d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "education" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "occupation" character varying(255)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_upload_files_user_type" ON "upload_files" USING btree ("type", "user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "upload_files" ADD CONSTRAINT "FK_upload_files_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
