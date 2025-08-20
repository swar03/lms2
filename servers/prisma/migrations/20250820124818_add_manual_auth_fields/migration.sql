/*
  Warnings:

  - You are about to drop the column `email_verified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "email_verified",
ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "google_id" DROP NOT NULL;
