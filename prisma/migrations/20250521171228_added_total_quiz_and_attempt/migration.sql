-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "attempt" INTEGER NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "totalPlayQuiz" INTEGER NOT NULL DEFAULT 0;
