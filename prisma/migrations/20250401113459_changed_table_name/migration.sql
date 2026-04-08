/*
  Warnings:

  - You are about to drop the `UserQuestionHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserQuestionHistory" DROP CONSTRAINT "UserQuestionHistory_user_id_fkey";

-- DropTable
DROP TABLE "UserQuestionHistory";

-- CreateTable
CREATE TABLE "user_questions_history" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "question_id" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_questions_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_questions_history" ADD CONSTRAINT "user_questions_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
