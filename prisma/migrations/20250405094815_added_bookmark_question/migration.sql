-- CreateTable
CREATE TABLE "bookmarked_questions" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarked_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookmarked_questions_user_id_question_id_key" ON "bookmarked_questions"("user_id", "question_id");

-- AddForeignKey
ALTER TABLE "bookmarked_questions" ADD CONSTRAINT "bookmarked_questions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarked_questions" ADD CONSTRAINT "bookmarked_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
