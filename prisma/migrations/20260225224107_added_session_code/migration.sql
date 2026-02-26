-- CreateTable
CREATE TABLE "SessionCode" (
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SessionCode_pkey" PRIMARY KEY ("code")
);
