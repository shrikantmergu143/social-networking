import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessageReceipts1793500000000 implements MigrationInterface {
  name = 'CreateMessageReceipts1793500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "message_receipts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "message_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "delivered_at" TIMESTAMP WITH TIME ZONE,
        "read_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "uq_message_receipt_message_user" UNIQUE ("message_id", "user_id"),
        CONSTRAINT "PK_message_receipts_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_message_receipts_message" FOREIGN KEY ("message_id")
          REFERENCES "chat_messages"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_message_receipts_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_message_receipts_user_read"
      ON "message_receipts" ("user_id", "read_at")
    `);
    await queryRunner.query(`
      INSERT INTO "message_receipts" ("message_id", "user_id", "delivered_at", "read_at")
      SELECT
        message."id",
        participant."user_id",
        CASE
          WHEN participant."user_id" = message."sender_id"
            OR message."status" IN ('delivered', 'read')
          THEN message."created_at"
          ELSE NULL
        END,
        CASE
          WHEN participant."user_id" <> message."sender_id"
            AND message."status" = 'read'
            AND own_participant."last_read_at" IS NOT NULL
            AND message."created_at" <= own_participant."last_read_at"
          THEN own_participant."last_read_at"
          ELSE NULL
        END
      FROM "chat_messages" message
      INNER JOIN "conversation_participants" participant
        ON participant."conversation_id" = message."conversation_id"
      LEFT JOIN "conversation_participants" own_participant
        ON own_participant."conversation_id" = message."conversation_id"
        AND own_participant."user_id" = participant."user_id"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_message_receipts_user_read"`);
    await queryRunner.query(`DROP TABLE "message_receipts"`);
  }
}
