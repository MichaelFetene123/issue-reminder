-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailToken" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "emailVerifid" BOOLEAN NOT NULL DEFAULT false;
