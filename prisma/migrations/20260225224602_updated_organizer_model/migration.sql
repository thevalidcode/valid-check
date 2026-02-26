-- AlterTable
ALTER TABLE "Organizer" ADD COLUMN     "name" TEXT,
ADD COLUMN     "picture" TEXT,
ALTER COLUMN "passwordHash" DROP NOT NULL;
