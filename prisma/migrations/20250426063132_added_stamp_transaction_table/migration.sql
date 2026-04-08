-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('ADD', 'REMOVE');

-- CreateTable
CREATE TABLE "stamp_transactions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "TransactionType" NOT NULL DEFAULT 'ADD',
    "count" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stamp_transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stamp_transactions" ADD CONSTRAINT "stamp_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
