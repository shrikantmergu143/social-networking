import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileCoordinates1793300000000 implements MigrationInterface {
  name = 'AddProfileCoordinates1793300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "latitude" double precision`);
    await queryRunner.query(`ALTER TABLE "users" ADD "longitude" double precision`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "longitude"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "latitude"`);
  }
}
