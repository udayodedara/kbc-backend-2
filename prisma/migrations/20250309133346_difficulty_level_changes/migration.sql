/*
  Warnings:

  - Changed the type of `difficulty_level` on the `questions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "questions" DROP COLUMN "difficulty_level",
ADD COLUMN     "difficulty_level" INTEGER NOT NULL;
