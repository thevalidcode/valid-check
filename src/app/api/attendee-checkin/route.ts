import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../prisma/generated/client";
import { securityMiddleware } from "@/lib/middleware/security";
import { requireAuth } from "@/lib/middleware/auth";
import { handleAPIError, createSuccessResponse, APIError } from "@/lib/errors";
import { prisma } from "../../../../prisma/client";
import { startOfDay, endOfDay } from "date-fns";

// POST /api/attendee-checkin - Check in an attendee to a check-in page
export async function POST(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const body = await request.json();
      const { checkInPageId, attendeeId, latitude, longitude } = body;

      if (!checkInPageId || !attendeeId) {
        throw new APIError(400, "Missing checkInPageId or attendeeId");
      }

      // 1. Fetch the check-in page
      const checkInPage = await prisma.checkInPage.findUnique({
        where: { id: checkInPageId },
      });

      if (!checkInPage) {
        throw new APIError(404, "Check-in portal not found.");
      }

      // 2. Status & Capacity Verification
      if (!checkInPage.isActive) {
        throw new APIError(403, "This check-in portal is currently inactive.");
      }

      // 3. Time Window Verification
      const now = new Date();

      if (checkInPage.capacity) {
        const count = await prisma.checkIn.count({
          where: {
            checkInPageId,
            ...(checkInPage.isRecurring
              ? {
                  checkedInAt: {
                    gte: startOfDay(now),
                    lte: endOfDay(now),
                  },
                }
              : {}),
          },
        });
        if (count >= checkInPage.capacity) {
          throw new APIError(
            403,
            checkInPage.isRecurring
              ? "Today's session has reached its full capacity."
              : "Event capacity reached. No more check-ins allowed.",
          );
        }
      }

      if (checkInPage.isRecurring) {
        // For recurring events, we check time of day and the recurrence end date
        if (
          checkInPage.recurrenceEnd &&
          now > endOfDay(new Date(checkInPage.recurrenceEnd))
        ) {
          throw new APIError(403, "This recurring event series has ended.");
        }

        // Check if the current day matches the recurring pattern
        if (checkInPage.recurrencePattern === "WEEKLY") {
          const originalDate = new Date(checkInPage.eventDate);
          if (now.getDay() !== originalDate.getDay()) {
            const days = [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ];
            throw new APIError(
              403,
              `This event only takes place on ${days[originalDate.getDay()]}s.`,
            );
          }
        } else if (checkInPage.recurrencePattern === "MONTHLY") {
          const originalDate = new Date(checkInPage.eventDate);
          if (now.getDate() !== originalDate.getDate()) {
            throw new APIError(
              403,
              `This event only takes place on the ${originalDate.getDate()}th of each month.`,
            );
          }
        }

        if (checkInPage.startTime || checkInPage.endTime) {
          const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

          if (checkInPage.startTime) {
            const start = new Date(checkInPage.startTime);
            const startInMinutes = start.getHours() * 60 + start.getMinutes();
            if (currentTimeInMinutes < startInMinutes) {
              throw new APIError(
                403,
                `Check-in for today's session hasn't started yet. Please come back at ${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
              );
            }
          }

          if (checkInPage.endTime) {
            const end = new Date(checkInPage.endTime);
            const endInMinutes = end.getHours() * 60 + end.getMinutes();
            if (currentTimeInMinutes > endInMinutes) {
              throw new APIError(
                403,
                "Check-in for today's session has already closed.",
              );
            }
          }
        }
      } else {
        // Single event window check
        const eventDate = new Date(checkInPage.eventDate);
        const isSameDay =
          now.getFullYear() === eventDate.getFullYear() &&
          now.getMonth() === eventDate.getMonth() &&
          now.getDate() === eventDate.getDate();

        if (!isSameDay) {
          if (now < eventDate) {
            throw new APIError(
              403,
              `This event is scheduled for ${eventDate.toLocaleDateString()}. Please come back then.`,
            );
          } else {
            throw new APIError(
              403,
              "The check-in period for this event has expired.",
            );
          }
        }

        if (checkInPage.startTime && now < new Date(checkInPage.startTime)) {
          throw new APIError(
            403,
            `Check-in hasn't opened yet. It starts at ${new Date(checkInPage.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
          );
        }
        if (checkInPage.endTime && now > new Date(checkInPage.endTime)) {
          throw new APIError(
            403,
            "The check-in window for this event has closed.",
          );
        }
      }

      // 4. Location verification
      if (checkInPage.requireLocation) {
        if (!latitude || !longitude) {
          throw new APIError(
            403,
            "Location access is required to verify your attendance.",
          );
        }

        if (checkInPage.latitude && checkInPage.longitude) {
          const R = 6371e3; // metres
          const φ1 = (checkInPage.latitude * Math.PI) / 180;
          const φ2 = (latitude * Math.PI) / 180;
          const Δφ = ((latitude - checkInPage.latitude) * Math.PI) / 180;
          const Δλ = ((longitude - checkInPage.longitude) * Math.PI) / 180;

          const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          const distance = R * c;

          if (distance > (checkInPage.radius || 100)) {
            throw new APIError(
              403,
              `Proximity check failed. You must be within ${checkInPage.radius || 100}m of the venue.`,
            );
          }
        }
      }

      // 5. Duplicate Check-in Logic
      const existingCheckIn = await prisma.checkIn.findFirst({
        where: {
          checkInPageId,
          attendeeId,
          ...(checkInPage.isRecurring
            ? {
                checkedInAt: {
                  gte: startOfDay(now),
                  lte: endOfDay(now),
                },
              }
            : {}),
        },
      });

      if (existingCheckIn) {
        throw new APIError(
          409,
          checkInPage.isRecurring
            ? "You have already checked in for today's session."
            : "Duplicate check-in detected. You are already registered for this event.",
        );
      }

      // 6. Perform Check-in
      const checkIn = await prisma.checkIn.create({
        data: {
          checkInPageId,
          attendeeId,
          ipAddress: request.headers.get("x-forwarded-for") || undefined,
          userAgent: request.headers.get("user-agent") || undefined,
        },
      });

      await prisma.auditLog.create({
        data: {
          organizerId: checkInPage.organizerId,
          action: "ATTENDEE_CHECKIN",
          metadata: { checkInPageId, attendeeId, checkInId: checkIn.id },
        },
      });

      return createSuccessResponse(
        checkIn,
        checkInPage.successMessage || "Attendee checked in successfully",
      );
    } catch (error) {
      return handleAPIError(error);
    }
  });
}

// GET /api/attendee-checkin - Get attendee info by id (auth only)
export async function GET(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const authResult = await requireAuth(request);
      if (authResult instanceof NextResponse) return authResult;

      const { searchParams } = new URL(request.url);
      const attendeeId = searchParams.get("attendeeId");

      if (!attendeeId) {
        throw new APIError(400, "Missing attendeeId");
      }

      const attendee = await prisma.attendee.findUnique({
        where: { id: attendeeId },
        include: {
          checkIns: true,
        },
      });

      if (!attendee) {
        throw new APIError(404, "Attendee not found");
      }

      return createSuccessResponse(attendee, "Attendee fetched successfully");
    } catch (error) {
      return handleAPIError(error);
    }
  });
}
