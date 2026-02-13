-- DropForeignKey
ALTER TABLE "CheckIn" DROP CONSTRAINT "CheckIn_checkInPageId_fkey";

-- AlterTable
ALTER TABLE "CheckInPage" ADD COLUMN     "collectDOB" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "collectPhone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recurrenceEnd" TIMESTAMP(3),
ADD COLUMN     "recurrencePattern" TEXT;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_checkInPageId_fkey" FOREIGN KEY ("checkInPageId") REFERENCES "CheckInPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
