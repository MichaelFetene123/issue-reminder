/*
  Warnings:

  - Added the required column `priority` to the `issues` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "priorityStatus" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "issues" ADD COLUMN     "priority" "priorityStatus" NOT NULL;
