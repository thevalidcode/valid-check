import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../prisma/generated/client";
import { securityMiddleware } from "@/lib/middleware/security";
import { requireAuth } from "@/lib/middleware/auth";
import {
  createCheckInPageSchema,
  updateCheckInPageSchema,
} from "@/lib/validation/schemas";
import {
  handleAPIError,
  createSuccessResponse,
  createPaginatedResponse,
  APIError,
} from "@/lib/errors";
import { prisma } from "../../../../prisma/client";

// GET /api/checkin-pages - List checkin-pages (auth only)
export async function GET(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const authResult = await requireAuth(request);
      if (authResult instanceof NextResponse) return authResult;

      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const search = searchParams.get("search");

      const skip = (page - 1) * limit;

      const where = search
        ? {
            OR: [
              {
                slug: { contains: search, mode: Prisma.QueryMode.insensitive },
                organizerId: authResult.user.id,
              },
            ],
          }
        : { organizerId: authResult.user.id };

      const [checkInPages, total] = await Promise.all([
        prisma.checkInPage.findMany({
          where,
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            eventDate: true,
            isActive: true,
            isRecurring: true,
            recurrencePattern: true,
            createdAt: true,
            recurrenceEnd: true,
            collectPhone: true,
            collectDOB: true,
            allowSelfRegistration: true,
            requireLocation: true,
            latitude: true,
            longitude: true,
            radius: true,
            successMessage: true,
            _count: {
              select: {
                checkIns: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.checkInPage.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return createPaginatedResponse(checkInPages, {
        page,
        limit,
        total,
        totalPages,
      });
    } catch (error) {
      return handleAPIError(error);
    }
  });
}

// POST /api/checkin-pages - Create checkinPage (auth only)
export async function POST(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const authResult = await requireAuth(request);
      if (authResult instanceof NextResponse) return authResult;

      const body = await request.json();
      const validatedData = createCheckInPageSchema.parse(body);

      // Check if slug already exists
      const existingCheckInPage = await prisma.checkInPage.findUnique({
        where: { slug: validatedData.slug },
      });

      if (existingCheckInPage) {
        throw new APIError(409, "Slug already registered");
      }

      // Convert date strings to Date objects
      const eventDate = new Date(validatedData.eventDate);

      // Helper to combine date and time
      const combineDateAndTime = (date: Date, timeStr?: string) => {
        if (!timeStr) return null;
        const [hours, minutes] = timeStr.split(":").map(Number);
        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
      };

      // Create check-in page
      const checkInPage = await prisma.checkInPage.create({
        data: {
          organizer: { connect: { id: authResult.user.id } },
          title: validatedData.title,
          slug: validatedData.slug,
          description: validatedData.description,
          eventDate,
          startTime: combineDateAndTime(eventDate, validatedData.startTime),
          endTime: combineDateAndTime(eventDate, validatedData.endTime),
          capacity: validatedData.capacity,
          isActive: validatedData.isActive,
          isRecurring: validatedData.isRecurring,
          recurrencePattern: validatedData.recurrencePattern,
          recurrenceEnd: validatedData.recurrenceEnd
            ? new Date(validatedData.recurrenceEnd)
            : null,
          collectPhone: validatedData.collectPhone,
          collectDOB: validatedData.collectDOB,
        },
      });

      // Log the creation
      await prisma.auditLog.create({
        data: {
          organizerId: authResult.user.id,
          action: "CREATE_CHECKIN_PAGE",
          metadata: { createdCheckInPageId: checkInPage.id },
        },
      });

      return createSuccessResponse(
        checkInPage,
        "Check-in page created successfully",
      );
    } catch (error) {
      return handleAPIError(error);
    }
  });
}

// PATCH /api/checkin-pages - Update checkinPage (auth only)
export async function PATCH(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const authResult = await requireAuth(request);
      if (authResult instanceof NextResponse) return authResult;

      const body = await request.json();
      const { id, ...updateData } = updateCheckInPageSchema.parse(body);

      if (!id) {
        throw new APIError(400, "Missing check-in page id");
      }

      // Only allow updating pages owned by the user
      const checkInPage = await prisma.checkInPage.findUnique({
        where: { id },
      });

      if (!checkInPage || checkInPage.organizerId !== authResult.user.id) {
        throw new APIError(404, "Check-in page not found");
      }

      // Convert date strings to Date objects if they exist
      const data: any = { ...updateData };
      if (updateData.eventDate) {
        data.eventDate = new Date(updateData.eventDate);
      }
      if (updateData.recurrenceEnd) {
        data.recurrenceEnd = new Date(updateData.recurrenceEnd);
      }

      // If we have eventDate and startTime/endTime, combine them
      const baseDate = data.eventDate || checkInPage.eventDate;
      if (updateData.startTime) {
        const [hours, minutes] = updateData.startTime.split(":").map(Number);
        const st = new Date(baseDate);
        st.setHours(hours, minutes, 0, 0);
        data.startTime = st;
      }
      if (updateData.endTime) {
        const [hours, minutes] = updateData.endTime.split(":").map(Number);
        const et = new Date(baseDate);
        et.setHours(hours, minutes, 0, 0);
        data.endTime = et;
      }

      const updatedCheckInPage = await prisma.checkInPage.update({
        where: { id },
        data,
      });

      // Log the update
      await prisma.auditLog.create({
        data: {
          organizerId: authResult.user.id,
          action: "UPDATE_CHECKIN_PAGE",
          metadata: { updatedCheckInPageId: id },
        },
      });

      return createSuccessResponse(
        updatedCheckInPage,
        "Check-in page updated successfully",
      );
    } catch (error) {
      return handleAPIError(error);
    }
  });
}

// DELETE /api/checkin-pages - Delete checkinPage (auth only)
export async function DELETE(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const authResult = await requireAuth(request);
      if (authResult instanceof NextResponse) return authResult;

      const { id } = await request.json();

      if (!id) {
        throw new APIError(400, "Missing check-in page id");
      }

      // Only allow deleting pages owned by the user
      const checkInPage = await prisma.checkInPage.findUnique({
        where: { id },
      });

      if (!checkInPage || checkInPage.organizerId !== authResult.user.id) {
        throw new APIError(404, "Check-in page not found");
      }

      await prisma.checkInPage.delete({
        where: { id },
      });

      // Log the deletion
      await prisma.auditLog.create({
        data: {
          organizerId: authResult.user.id,
          action: "DELETE_CHECKIN_PAGE",
          metadata: { deletedCheckInPageId: id },
        },
      });

      return createSuccessResponse(
        { id },
        "Check-in page deleted successfully",
      );
    } catch (error) {
      return handleAPIError(error);
    }
  });
}
