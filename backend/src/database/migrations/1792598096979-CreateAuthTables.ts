import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthTables1792598096979 implements MigrationInterface {
  name = 'CreateAuthTables1792598096979';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "occupation" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "education" character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "education"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "occupation"`);
  }
}
