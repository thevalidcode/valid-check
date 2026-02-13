import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../prisma/generated/client";
import { securityMiddleware } from "@/lib/middleware/security";
import { requireAuth } from "@/lib/middleware/auth";
import { handleAPIError, createPaginatedResponse } from "@/lib/errors";
import { prisma } from "../../../../prisma/client";

// GET /api/audit-logs - List audit logs for the authenticated organizer
export async function GET(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const authResult = await requireAuth(request);
      if (authResult instanceof NextResponse) return authResult;

      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const action = searchParams.get("action");

      const skip = (page - 1) * limit;

      const where: Prisma.AuditLogWhereInput = {
        organizerId: authResult.user.id,
        ...(action
          ? { action: { contains: action, mode: Prisma.QueryMode.insensitive } }
          : {}),
      };

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.auditLog.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return createPaginatedResponse(logs, {
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
