import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";
import { securityMiddleware } from "@/lib/middleware/security";
import { handleAPIError, APIError, createSuccessResponse } from "@/lib/errors";

export async function POST(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const { session_code, slug } = await request.json();

      if (!session_code) {
        throw new APIError(400, "Session code is required");
      }

      const session = await prisma.sessionCode.findUnique({
        where: { code: session_code },
      });

      if (!session || session.used || session.expiresAt < new Date()) {
        throw new APIError(401, "Invalid or expired session code");
      }

      // Mark code as used
      await prisma.sessionCode.update({
        where: { code: session_code },
        data: { used: true },
      });

      // Find the attendee by email
      const attendee = await prisma.attendee.findFirst({
        where: { email: session.email },
      });

      if (!attendee) {
        throw new APIError(404, "Attendee not found");
      }

      let alreadyCheckedIn = false;
      if (slug) {
        const checkInPage = await prisma.checkInPage.findUnique({
          where: { slug },
        });
        if (checkInPage) {
          const checkin = await prisma.checkIn.findFirst({
            where: {
              attendeeId: attendee.id,
              checkInPageId: checkInPage.id,
            },
          });
          alreadyCheckedIn = !!checkin;
        }
      }

      return createSuccessResponse(
        { attendee, alreadyCheckedIn },
        "Session exchanged successfully",
      );
    } catch (error) {
      return handleAPIError(error);
    }
  });
}
