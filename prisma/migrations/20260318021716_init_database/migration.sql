/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar_url" VARCHAR(255),
    "gender" VARCHAR(10),
    "birth_date" DATE,
    "languagePreference" TEXT,
    "refreshToken" TEXT,
    "fcmToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "children" (
    "child_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" VARCHAR NOT NULL,
    "birth_date" DATE,
    "gender" VARCHAR,
    "avatar_url" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "children_pkey" PRIMARY KEY ("child_id")
);

-- CreateTable
CREATE TABLE "routine_time_blocks" (
    "block_id" TEXT NOT NULL,
    "routine_id" TEXT NOT NULL,
    "activity_type" VARCHAR NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "description" VARCHAR,

    CONSTRAINT "routine_time_blocks_pkey" PRIMARY KEY ("block_id")
);

-- CreateTable
CREATE TABLE "routines" (
    "routine_id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "routine_name" VARCHAR NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by_ai" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routines_pkey" PRIMARY KEY ("routine_id")
);

-- CreateTable
CREATE TABLE "golden_time_slots" (
    "slot_id" TEXT NOT NULL,
    "routine_id" TEXT NOT NULL,
    "slot_type" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "context" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_notified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "golden_time_slots_pkey" PRIMARY KEY ("slot_id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "conversation_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "conversation_type" TEXT NOT NULL,
    "input_text" TEXT NOT NULL,
    "output_text" TEXT,
    "phonetic" TEXT,
    "suggestions" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("conversation_id")
);

-- CreateTable
CREATE TABLE "learning_logs" (
    "learning_log_id" SERIAL NOT NULL,
    "child_id" TEXT NOT NULL,
    "mini_song_id" TEXT,
    "story_id" INTEGER,
    "slot_id" TEXT,
    "progress_percent" INTEGER,
    "time_spent_seconds" INTEGER,
    "last_position_seconds" INTEGER,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "last_accessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_logs_pkey" PRIMARY KEY ("learning_log_id")
);

-- CreateTable
CREATE TABLE "stories" (
    "story_id" SERIAL NOT NULL,
    "topic_id" INTEGER,
    "title" VARCHAR NOT NULL,
    "age_min" INTEGER,
    "age_max" INTEGER,
    "duration_seconds" INTEGER,
    "cover_image_url" VARCHAR,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("story_id")
);

-- CreateTable
CREATE TABLE "story_segments" (
    "segment_id" SERIAL NOT NULL,
    "story_id" INTEGER NOT NULL,
    "segment_order" INTEGER NOT NULL,
    "content_text" TEXT,
    "image_url" VARCHAR,
    "audio_url" VARCHAR,
    "interaction_type" VARCHAR,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "story_segments_pkey" PRIMARY KEY ("segment_id")
);

-- CreateTable
CREATE TABLE "object_recognition_logs" (
    "recognition_id" SERIAL NOT NULL,
    "child_id" TEXT NOT NULL,
    "detected_object" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "object_recognition_logs_pkey" PRIMARY KEY ("recognition_id")
);

-- CreateTable
CREATE TABLE "mini_songs" (
    "mini_song_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "thumbnail" VARCHAR(500),
    "duration" DOUBLE PRECISION,
    "views" INTEGER NOT NULL DEFAULT 0,
    "video_url" VARCHAR(500),
    "category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mini_songs_pkey" PRIMARY KEY ("mini_song_id")
);

-- CreateTable
CREATE TABLE "song_lyrics" (
    "id" TEXT NOT NULL,
    "song_id" TEXT NOT NULL,
    "line_order" INTEGER NOT NULL,
    "lyric_text" TEXT,
    "phonetic" TEXT,
    "start_time" DOUBLE PRECISION,

    CONSTRAINT "song_lyrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mini_song_questions" (
    "question_id" TEXT NOT NULL,
    "mini_song_id" TEXT NOT NULL,
    "vocabulary" TEXT NOT NULL,
    "start_time" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "mini_song_questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "question_images" (
    "image_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "question_images_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "topics" (
    "topic_id" TEXT NOT NULL,
    "topic_name" VARCHAR NOT NULL,
    "icon" VARCHAR,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("topic_id")
);

-- CreateTable
CREATE TABLE "levels" (
    "level_id" TEXT NOT NULL,
    "level_name" VARCHAR NOT NULL,

    CONSTRAINT "levels_pkey" PRIMARY KEY ("level_id")
);

-- CreateTable
CREATE TABLE "sentences" (
    "sentence_id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "level_id" TEXT NOT NULL,
    "child_id" TEXT,
    "sentence_text" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "phonetic" TEXT NOT NULL,
    "audio_url" VARCHAR,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sentences_pkey" PRIMARY KEY ("sentence_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "golden_time_slots_routine_id_idx" ON "golden_time_slots"("routine_id");

-- CreateIndex
CREATE INDEX "learning_logs_child_id_idx" ON "learning_logs"("child_id");

-- CreateIndex
CREATE INDEX "learning_logs_mini_song_id_idx" ON "learning_logs"("mini_song_id");

-- CreateIndex
CREATE INDEX "learning_logs_slot_id_idx" ON "learning_logs"("slot_id");

-- CreateIndex
CREATE INDEX "learning_logs_story_id_idx" ON "learning_logs"("story_id");

-- CreateIndex
CREATE INDEX "stories_topic_id_idx" ON "stories"("topic_id");

-- CreateIndex
CREATE INDEX "story_segments_story_id_idx" ON "story_segments"("story_id");

-- CreateIndex
CREATE INDEX "object_recognition_logs_child_id_idx" ON "object_recognition_logs"("child_id");

-- CreateIndex
CREATE UNIQUE INDEX "mini_songs_title_key" ON "mini_songs"("title");

-- CreateIndex
CREATE INDEX "song_lyrics_song_id_idx" ON "song_lyrics"("song_id");

-- CreateIndex
CREATE INDEX "sentences_topic_id_idx" ON "sentences"("topic_id");

-- CreateIndex
CREATE INDEX "sentences_level_id_idx" ON "sentences"("level_id");

-- CreateIndex
CREATE INDEX "sentences_child_id_idx" ON "sentences"("child_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_sent_at_idx" ON "notifications"("sent_at");

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_time_blocks" ADD CONSTRAINT "routine_time_blocks_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routines"("routine_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routines" ADD CONSTRAINT "routines_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("child_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "golden_time_slots" ADD CONSTRAINT "golden_time_slots_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routines"("routine_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_logs" ADD CONSTRAINT "learning_logs_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("child_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_logs" ADD CONSTRAINT "learning_logs_mini_song_id_fkey" FOREIGN KEY ("mini_song_id") REFERENCES "mini_songs"("mini_song_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_logs" ADD CONSTRAINT "learning_logs_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "golden_time_slots"("slot_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_logs" ADD CONSTRAINT "learning_logs_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("story_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_segments" ADD CONSTRAINT "story_segments_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("story_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "object_recognition_logs" ADD CONSTRAINT "object_recognition_logs_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("child_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_lyrics" ADD CONSTRAINT "song_lyrics_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "mini_songs"("mini_song_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mini_song_questions" ADD CONSTRAINT "mini_song_questions_mini_song_id_fkey" FOREIGN KEY ("mini_song_id") REFERENCES "mini_songs"("mini_song_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_images" ADD CONSTRAINT "question_images_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "mini_song_questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentences" ADD CONSTRAINT "sentences_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentences" ADD CONSTRAINT "sentences_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels"("level_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentences" ADD CONSTRAINT "sentences_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("child_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
