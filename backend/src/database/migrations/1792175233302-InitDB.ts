import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDB1792175233302 implements MigrationInterface {
  name = 'InitDB1792175233302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_dating_preferences_gender_preferences_enum" AS ENUM('woman', 'man', 'non-binary', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_dating_preferences_intensions_enum" AS ENUM('Long-term partner', 'Long-term, open to short', 'Short-term, open to long', 'Short-term fun', 'New friends', 'Still figuring it out')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_dating_preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "gender_preferences" "public"."user_dating_preferences_gender_preferences_enum" array NOT NULL DEFAULT '{}', "min_age" smallint NOT NULL DEFAULT '18', "max_age" smallint NOT NULL DEFAULT '18', "max_distance_km" numeric(8,2) NOT NULL DEFAULT '50', "intensions" "public"."user_dating_preferences_intensions_enum" array NOT NULL DEFAULT '{}', "verified_only" boolean NOT NULL DEFAULT false, "recently_active_only" boolean NOT NULL DEFAULT false, "online_only" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_5a1094ab626441034297d584449" UNIQUE ("user_id"), CONSTRAINT "REL_5a1094ab626441034297d58444" UNIQUE ("user_id"), CONSTRAINT "PK_c9d8775aef669e5c2f8d2bb7cfe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_lifestyles_drinking_enum" AS ENUM('Never', 'Socially', 'Frequently')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_lifestyles_smoking_enum" AS ENUM('Never', 'Socially', 'Regularly')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_lifestyles_exercise_enum" AS ENUM('Active', 'Sometimes', 'Almost never')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_lifestyles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "drinking" "public"."user_lifestyles_drinking_enum", "smoking" "public"."user_lifestyles_smoking_enum", "exercise" "public"."user_lifestyles_exercise_enum", "pets" character varying(100), "zodiac" character varying(50), "education" character varying(150), "occupation" character varying(150), "languages" character varying(100) array NOT NULL DEFAULT '{}', CONSTRAINT "UQ_540cb5a963675b4e9d433d40c70" UNIQUE ("user_id"), CONSTRAINT "REL_540cb5a963675b4e9d433d40c7" UNIQUE ("user_id"), CONSTRAINT "PK_c6bdaafc128eb38f388a37a8904" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_photos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "photo_url" text NOT NULL, "display_order" smallint NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_408dc17e8ec2d9c7cdafcb7ee43" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_interests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "interest" character varying(100) NOT NULL, CONSTRAINT "uq_user_interest" UNIQUE ("user_id", "interest"), CONSTRAINT "PK_cdfda991bb843bc8736cde962cc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_social_links" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "platform" character varying(30) NOT NULL, "profile_url" text NOT NULL, CONSTRAINT "uq_user_social_platform" UNIQUE ("user_id", "platform"), CONSTRAINT "PK_b4c7169f96da377cc8300db0993" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_gender_enum" AS ENUM('woman', 'man', 'non-binary', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_relationship_goal_enum" AS ENUM('Long-term partner', 'Long-term, open to short', 'Short-term, open to long', 'Short-term fun', 'New friends', 'Still figuring it out')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(50) NOT NULL, "full_name" character varying(150) NOT NULL, "birth_name" date, "gender" "public"."users_gender_enum" NOT NULL, "pronouns" character varying(50), "location" character varying(255), "bio" text NOT NULL DEFAULT '', "avatar" text, "cover_image" text, "relationship_goal" "public"."users_relationship_goal_enum", "is_verified" boolean NOT NULL DEFAULT false, "is_online" boolean NOT NULL DEFAULT false, "last_active" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users"  ("username") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."chat_messages_status_enum" AS ENUM('sent', 'delivered', 'read')`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "conversation_id" uuid NOT NULL, "sender_id" uuid NOT NULL, "text" text NOT NULL DEFAULT '', "image_url" text, "status" "public"."chat_messages_status_enum" NOT NULL DEFAULT 'sent', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_chat_messages_conversation_created" ON "chat_messages"  ("conversation_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversation_participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "conversation_id" uuid NOT NULL, "user_id" uuid NOT NULL, "last_read_at" TIMESTAMP WITH TIME ZONE, "is_muted" boolean NOT NULL DEFAULT false, "joined_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_conversation_participant" UNIQUE ("conversation_id", "user_id"), CONSTRAINT "PK_61b51428ad9453f5921369fbe94" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."dating_actions_action_enum" AS ENUM('like', 'pass', 'superlike')`,
    );
    await queryRunner.query(
      `CREATE TABLE "dating_actions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "actor_id" uuid NOT NULL, "profile_id" uuid NOT NULL, "action" "public"."dating_actions_action_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_dating_action_actor_target" UNIQUE ("actor_id", "profile_id"), CONSTRAINT "PK_c90cfcdd36852584b9ece2d70e1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_dating_actions_target" ON "dating_actions"  ("profile_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "dating_matches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_one_id" uuid NOT NULL, "user_two_id" uuid NOT NULL, "matched_at" TIMESTAMP WITH TIME ZONE NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_dating_match_pair" UNIQUE ("user_one_id", "user_two_id"), CONSTRAINT "chk_dating_match_different_users" CHECK ("user_one_id" <> "user_two_id"), CONSTRAINT "PK_624f145b1bff6c30fa91c8aa64e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_type_enum" AS ENUM('like', 'comment', 'follow', 'match', 'message', 'system')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_target_type_enum" AS ENUM('post', 'profile', 'conversation')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "actor_id" uuid, "type" "public"."notifications_type_enum" NOT NULL, "text" text NOT NULL, "target_id" uuid, "target_type" "public"."notifications_target_type_enum", "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_notifications_user_created" ON "notifications"  ("user_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "post_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "post_id" uuid NOT NULL, "image_url" text NOT NULL, "display_order" smallint NOT NULL DEFAULT '0', CONSTRAINT "PK_32fe67d8cdea0e7536320d7c454" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "post_id" uuid NOT NULL, "tag" character varying(100) NOT NULL, CONSTRAINT "uq_post_tag" UNIQUE ("post_id", "tag"), CONSTRAINT "PK_0c750579b992a52b24d18ec3431" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "post_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_post_like_user" UNIQUE ("post_id", "user_id"), CONSTRAINT "PK_e4ac7cb9daf243939c6eabb2e0d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_saves" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "post_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_post_save_user" UNIQUE ("post_id", "user_id"), CONSTRAINT "PK_cc353b734984826187670b5bca5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."posts_visibility_enum" AS ENUM('public', 'connections', 'close_friends')`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "caption" text NOT NULL DEFAULT '', "visibility" "public"."posts_visibility_enum" NOT NULL DEFAULT 'public', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_posts_user_created" ON "posts"  ("user_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "post_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "post_id" uuid NOT NULL, "user_id" uuid NOT NULL, "parent_comment_id" uuid, "text" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2e99e04b4a1b31de6f833c18ced" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_post_comments_post_created" ON "post_comments"  ("post_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "post_comment_likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "comment_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_comment_like_user" UNIQUE ("comment_id", "user_id"), CONSTRAINT "PK_e45bcfb254e1ae760f2ad7bc7d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "story_views" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "story_id" uuid NOT NULL, "story_item_id" uuid NOT NULL, "user_id" uuid NOT NULL, "viewed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_story_viewer_item" UNIQUE ("story_item_id", "user_id"), CONSTRAINT "PK_288c121f49726ec216a274e3aab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bb6f880b260ed96c452b32a39f0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."story_items_media_type_enum" AS ENUM('image', 'video')`,
    );
    await queryRunner.query(
      `CREATE TABLE "story_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "story_id" uuid NOT NULL, "media_url" text NOT NULL, "media_type" "public"."story_items_media_type_enum" NOT NULL, "duration_seconds" smallint NOT NULL DEFAULT '5', "caption" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f0d18176a47af50ec654b7b8334" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_follows" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "follower_id" uuid NOT NULL, "following_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_user_follow" UNIQUE ("follower_id", "following_id"), CONSTRAINT "chk_user_follow_not_self" CHECK ("follower_id" <> "following_id"), CONSTRAINT "PK_da8e8793113adf3015952880966" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_dating_preferences" ADD CONSTRAINT "FK_5a1094ab626441034297d584449" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_lifestyles" ADD CONSTRAINT "FK_540cb5a963675b4e9d433d40c70" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_photos" ADD CONSTRAINT "FK_1faff88f0aaaa07a7c1fec2d5c4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_interests" ADD CONSTRAINT "FK_cb0511a8fabd1a2ac9912f7a9aa" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_social_links" ADD CONSTRAINT "FK_73c24ed6c34f6eced4f04e3af0f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_3d623662d4ee1219b23cf61e649" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_9e5fc47ecb06d4d7b84633b1718" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" ADD CONSTRAINT "FK_1559e8a16b828f2e836a2312800" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" ADD CONSTRAINT "FK_377d4041a495b81ee1a85ae026f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dating_actions" ADD CONSTRAINT "FK_b95254bdd5290bb2159fc872fd9" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dating_actions" ADD CONSTRAINT "FK_1edd13eca9b4c74cd744c8091f3" FOREIGN KEY ("profile_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dating_matches" ADD CONSTRAINT "FK_3e3f51bb3fc73c2de8106f7606c" FOREIGN KEY ("user_one_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dating_matches" ADD CONSTRAINT "FK_4fa28a1128ac3f9186930d6ea09" FOREIGN KEY ("user_two_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_20f8b51fd9655c0b69feed5efc6" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_images" ADD CONSTRAINT "FK_cbea080987be6204e913a691aea" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_tags" ADD CONSTRAINT "FK_5df4e8dc2cb3e668b962362265d" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes" ADD CONSTRAINT "FK_b40d37469c501092203d285af80" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes" ADD CONSTRAINT "FK_9b9a7fc5eeff133cf71b8e06a7b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_saves" ADD CONSTRAINT "FK_355ebd53d93832b425412d27b1b" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_saves" ADD CONSTRAINT "FK_6a7514ae4838468521daef6bdf9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comments" ADD CONSTRAINT "FK_e8ffd07822f03f90f637b13cd59" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comments" ADD CONSTRAINT "FK_8eb985b7bd35fd7bc760b6cbe8b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comments" ADD CONSTRAINT "FK_47e60da1f7aeb75961190bff75d" FOREIGN KEY ("parent_comment_id") REFERENCES "post_comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comment_likes" ADD CONSTRAINT "FK_4f91f8ed44eafd0731fadf13edc" FOREIGN KEY ("comment_id") REFERENCES "post_comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comment_likes" ADD CONSTRAINT "FK_118b4c673695e8f9573a70e5dd0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "story_views" ADD CONSTRAINT "FK_e30910f5c5e7cefc96f92d17331" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "story_views" ADD CONSTRAINT "FK_e9eb64e04d1f9d9cfa2f347bebf" FOREIGN KEY ("story_item_id") REFERENCES "story_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "story_views" ADD CONSTRAINT "FK_957569250010b2ec66127999d15" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stories" ADD CONSTRAINT "FK_ab4ee230faf536e7c5aee12f4ea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "story_items" ADD CONSTRAINT "FK_7ec15874efb211cd8ae3b53ee8b" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_follows" ADD CONSTRAINT "FK_f7af3bf8f2dcba61b4adc108239" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_follows" ADD CONSTRAINT "FK_5a71643cec3110af425f92e76e5" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_follows" DROP CONSTRAINT "FK_5a71643cec3110af425f92e76e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_follows" DROP CONSTRAINT "FK_f7af3bf8f2dcba61b4adc108239"`,
    );
    await queryRunner.query(
      `ALTER TABLE "story_items" DROP CONSTRAINT "FK_7ec15874efb211cd8ae3b53ee8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stories" DROP CONSTRAINT "FK_ab4ee230faf536e7c5aee12f4ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "story_views" DROP CONSTRAINT "FK_957569250010b2ec66127999d15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "story_views" DROP CONSTRAINT "FK_e9eb64e04d1f9d9cfa2f347bebf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "story_views" DROP CONSTRAINT "FK_e30910f5c5e7cefc96f92d17331"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comment_likes" DROP CONSTRAINT "FK_118b4c673695e8f9573a70e5dd0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comment_likes" DROP CONSTRAINT "FK_4f91f8ed44eafd0731fadf13edc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comments" DROP CONSTRAINT "FK_47e60da1f7aeb75961190bff75d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comments" DROP CONSTRAINT "FK_8eb985b7bd35fd7bc760b6cbe8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comments" DROP CONSTRAINT "FK_e8ffd07822f03f90f637b13cd59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_saves" DROP CONSTRAINT "FK_6a7514ae4838468521daef6bdf9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_saves" DROP CONSTRAINT "FK_355ebd53d93832b425412d27b1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes" DROP CONSTRAINT "FK_9b9a7fc5eeff133cf71b8e06a7b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes" DROP CONSTRAINT "FK_b40d37469c501092203d285af80"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_tags" DROP CONSTRAINT "FK_5df4e8dc2cb3e668b962362265d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_images" DROP CONSTRAINT "FK_cbea080987be6204e913a691aea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_20f8b51fd9655c0b69feed5efc6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dating_matches" DROP CONSTRAINT "FK_4fa28a1128ac3f9186930d6ea09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dating_matches" DROP CONSTRAINT "FK_3e3f51bb3fc73c2de8106f7606c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dating_actions" DROP CONSTRAINT "FK_1edd13eca9b4c74cd744c8091f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dating_actions" DROP CONSTRAINT "FK_b95254bdd5290bb2159fc872fd9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" DROP CONSTRAINT "FK_377d4041a495b81ee1a85ae026f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participants" DROP CONSTRAINT "FK_1559e8a16b828f2e836a2312800"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_9e5fc47ecb06d4d7b84633b1718"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_3d623662d4ee1219b23cf61e649"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_social_links" DROP CONSTRAINT "FK_73c24ed6c34f6eced4f04e3af0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_interests" DROP CONSTRAINT "FK_cb0511a8fabd1a2ac9912f7a9aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_photos" DROP CONSTRAINT "FK_1faff88f0aaaa07a7c1fec2d5c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_lifestyles" DROP CONSTRAINT "FK_540cb5a963675b4e9d433d40c70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_dating_preferences" DROP CONSTRAINT "FK_5a1094ab626441034297d584449"`,
    );
    await queryRunner.query(`DROP TABLE "user_follows"`);
    await queryRunner.query(`DROP TABLE "story_items"`);
    await queryRunner.query(`DROP TYPE "public"."story_items_media_type_enum"`);
    await queryRunner.query(`DROP TABLE "stories"`);
    await queryRunner.query(`DROP TABLE "story_views"`);
    await queryRunner.query(`DROP TABLE "post_comment_likes"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_post_comments_post_created"`,
    );
    await queryRunner.query(`DROP TABLE "post_comments"`);
    await queryRunner.query(`DROP INDEX "public"."idx_posts_user_created"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TYPE "public"."posts_visibility_enum"`);
    await queryRunner.query(`DROP TABLE "post_saves"`);
    await queryRunner.query(`DROP TABLE "post_likes"`);
    await queryRunner.query(`DROP TABLE "post_tags"`);
    await queryRunner.query(`DROP TABLE "post_images"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_notifications_user_created"`,
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(
      `DROP TYPE "public"."notifications_target_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    await queryRunner.query(`DROP TABLE "dating_matches"`);
    await queryRunner.query(`DROP INDEX "public"."idx_dating_actions_target"`);
    await queryRunner.query(`DROP TABLE "dating_actions"`);
    await queryRunner.query(`DROP TYPE "public"."dating_actions_action_enum"`);
    await queryRunner.query(`DROP TABLE "conversation_participants"`);
    await queryRunner.query(`DROP TABLE "conversations"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_chat_messages_conversation_created"`,
    );
    await queryRunner.query(`DROP TABLE "chat_messages"`);
    await queryRunner.query(`DROP TYPE "public"."chat_messages_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(
      `DROP TYPE "public"."users_relationship_goal_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
    await queryRunner.query(`DROP TABLE "user_social_links"`);
    await queryRunner.query(`DROP TABLE "user_interests"`);
    await queryRunner.query(`DROP TABLE "user_photos"`);
    await queryRunner.query(`DROP TABLE "user_lifestyles"`);
    await queryRunner.query(
      `DROP TYPE "public"."user_lifestyles_exercise_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."user_lifestyles_smoking_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."user_lifestyles_drinking_enum"`,
    );
    await queryRunner.query(`DROP TABLE "user_dating_preferences"`);
    await queryRunner.query(
      `DROP TYPE "public"."user_dating_preferences_intensions_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."user_dating_preferences_gender_preferences_enum"`,
    );
  }
}
