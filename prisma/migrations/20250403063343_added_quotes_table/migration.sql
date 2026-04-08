/*
  Warnings:

  - You are about to drop the column `minimum_suuported_version` on the `app_config` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "app_config" DROP COLUMN "minimum_suuported_version",
ADD COLUMN     "minimum_supported_version" TEXT;

-- AlterTable
ALTER TABLE "user_settings" ADD COLUMN     "vibration" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "quotes" (
    "id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);
