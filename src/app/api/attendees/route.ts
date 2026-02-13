import { NextRequest, NextResponse } from "next/server";
import { securityMiddleware } from "@/lib/middleware/security";
import { prisma } from "../../../../prisma/client";
import { handleAPIError, createSuccessResponse, APIError } from "@/lib/errors";
import { createAttendeeSchema } from "@/lib/validation/schemas";

// POST /api/attendees - Create attendee (public)
export async function POST(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const body = await request.json();
      const validated = createAttendeeSchema.parse(body);

      const attendee = await prisma.attendee.create({
        data: validated,
      });

      return createSuccessResponse(attendee, "Attendee created successfully");
    } catch (error) {
      return handleAPIError(error);
    }
  });
}

// GET /api/attendees?email= - Find attendee by email (public)
export async function GET(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const { searchParams } = new URL(request.url);
      const email = searchParams.get("email");

      if (!email) {
        throw new APIError(400, "Missing email");
      }

      const attendee = await prisma.attendee.findFirst({
        where: { email },
      });

      if (!attendee) {
        return new NextResponse(JSON.stringify({ data: null }), { status: 200 });
      }

      return createSuccessResponse(attendee, "Attendee found");
    } catch (error) {
      return handleAPIError(error);
    }
  });
}

// PATCH /api/attendees - Update attendee info (public/private)
export async function PATCH(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const body = await request.json();
      const { id, ...data } = body;

      if (!id) {
        throw new APIError(400, "Missing attendee ID");
      }

      // Handle dateOfBirth conversion if it's coming from client
      const updateData: any = { ...data };
      if (updateData.dateOfBirth) {
        try {
          updateData.dateOfBirth = new Date(updateData.dateOfBirth).toISOString();
        } catch (e) {
          throw new APIError(400, "Invalid date format for dateOfBirth");
        }
      }

      const attendee = await prisma.attendee.update({
        where: { id },
        data: updateData,
      });

      return createSuccessResponse(attendee, "Attendee updated successfully");
    } catch (error) {
      return handleAPIError(error);
    }
  });
}
