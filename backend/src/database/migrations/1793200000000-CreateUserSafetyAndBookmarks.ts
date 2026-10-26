import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserSafetyAndBookmarks1793200000000 implements MigrationInterface {
  name = 'CreateUserSafetyAndBookmarks1793200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_blocks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "blocked_user_id" uuid NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "uq_user_block" UNIQUE ("user_id", "blocked_user_id"),
        CONSTRAINT "chk_user_block_not_self" CHECK ("user_id" <> "blocked_user_id"),
        CONSTRAINT "PK_user_blocks_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_blocks_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_blocks_blocked_user" FOREIGN KEY ("blocked_user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "saved_profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "profile_id" uuid NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "uq_saved_profile" UNIQUE ("user_id", "profile_id"),
        CONSTRAINT "PK_saved_profiles_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_saved_profiles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_saved_profiles_profile" FOREIGN KEY ("profile_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "user_reports" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "reporter_id" uuid NOT NULL,
        "reported_user_id" uuid NOT NULL,
        "reason" character varying(200) NOT NULL,
        "details" text NOT NULL DEFAULT '',
        "status" character varying(20) NOT NULL DEFAULT 'pending',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_reports_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_reports_reporter" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_reports_target" FOREIGN KEY ("reported_user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_user_reports_status_created" ON "user_reports" ("status", "created_at")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_user_reports_status_created"`);
    await queryRunner.query(`DROP TABLE "user_reports"`);
    await queryRunner.query(`DROP TABLE "saved_profiles"`);
    await queryRunner.query(`DROP TABLE "user_blocks"`);
  }
}
