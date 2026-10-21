import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserSettings1793100000000 implements MigrationInterface {
  name = 'CreateUserSettings1793100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "settings" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "UQ_user_settings_user_id" UNIQUE ("user_id"), CONSTRAINT "PK_user_settings_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_settings_user_id" ON "user_settings" ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" ADD CONSTRAINT "FK_user_settings_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_settings" DROP CONSTRAINT "FK_user_settings_user_id"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_user_settings_user_id"`);
    await queryRunner.query(`DROP TABLE "user_settings"`);
  }
}
