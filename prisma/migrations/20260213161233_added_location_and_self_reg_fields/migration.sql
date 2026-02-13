-- AlterTable
ALTER TABLE "CheckInPage" ADD COLUMN     "allowSelfRegistration" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "locationName" TEXT,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "radius" INTEGER DEFAULT 100,
ADD COLUMN     "requireLocation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "successMessage" TEXT DEFAULT 'Thank you for checking in!';
