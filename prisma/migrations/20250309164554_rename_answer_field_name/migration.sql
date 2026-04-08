/*
  Warnings:

  - You are about to drop the column `optionA` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `optionB` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `optionC` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `optionD` on the `questions` table. All the data in the column will be lost.
  - Added the required column `a` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `b` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `c` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `d` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "questions" DROP COLUMN "optionA",
DROP COLUMN "optionB",
DROP COLUMN "optionC",
DROP COLUMN "optionD",
ADD COLUMN     "a" TEXT NOT NULL,
ADD COLUMN     "b" TEXT NOT NULL,
ADD COLUMN     "c" TEXT NOT NULL,
ADD COLUMN     "d" TEXT NOT NULL;
