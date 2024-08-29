/*
  Warnings:

  - You are about to drop the column `isPaid` on the `Booking` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'SUCCESSED', 'CANCELED');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "isPaid",
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'PENDING';
