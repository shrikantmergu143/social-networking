import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUploadFiles1793000000000 implements MigrationInterface {
  name = 'CreateUploadFiles1793000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "upload_files" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "type" character varying(30) NOT NULL,
        "original_name" character varying(255) NOT NULL,
        "file_name" character varying(255) NOT NULL,
        "storage_path" text NOT NULL,
        "url" text NOT NULL,
        "mime_type" character varying(100) NOT NULL,
        "size" bigint NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_upload_files_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_upload_files_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_upload_files_user_type" ON "upload_files" ("user_id", "type")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_upload_files_user_type"`);
    await queryRunner.query(`DROP TABLE "upload_files"`);
  }
}
