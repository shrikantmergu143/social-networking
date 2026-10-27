import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPrivateProfilesAndFollowRequests1793400000000 implements MigrationInterface {
  name = 'AddPrivateProfilesAndFollowRequests1793400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "is_private" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`
      CREATE TABLE "user_follow_requests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "requester_id" uuid NOT NULL,
        "target_id" uuid NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "uq_user_follow_request" UNIQUE ("requester_id", "target_id"),
        CONSTRAINT "chk_user_follow_request_not_self" CHECK ("requester_id" <> "target_id"),
        CONSTRAINT "PK_user_follow_requests_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_follow_requests_requester" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_follow_requests_target" FOREIGN KEY ("target_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `ALTER TYPE "public"."notifications_type_enum" RENAME TO "notifications_type_enum_old"`,
    );
    await queryRunner.query(`
      CREATE TYPE "public"."notifications_type_enum" AS ENUM(
        'like', 'comment', 'follow', 'follow_request', 'follow_accepted',
        'match', 'message', 'superlike', 'system'
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "notifications" ALTER COLUMN "type"
      TYPE "public"."notifications_type_enum"
      USING "type"::text::"public"."notifications_type_enum"
    `);
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."notifications_type_enum" RENAME TO "notifications_type_enum_new"`,
    );
    await queryRunner.query(`
      CREATE TYPE "public"."notifications_type_enum" AS ENUM('like', 'comment', 'follow', 'match', 'message', 'system')
    `);
    await queryRunner.query(`
      ALTER TABLE "notifications" ALTER COLUMN "type"
      TYPE "public"."notifications_type_enum"
      USING CASE
        WHEN "type"::text IN ('follow_request', 'follow_accepted') THEN 'follow'
        WHEN "type"::text = 'superlike' THEN 'like'
        ELSE "type"::text
      END::"public"."notifications_type_enum"
    `);
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum_new"`);
    await queryRunner.query(`DROP TABLE "user_follow_requests"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_private"`);
  }
}
