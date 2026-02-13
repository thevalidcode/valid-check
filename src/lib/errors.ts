import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error("API Error:", error);

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 400 },
    );
  }

  // Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as any;

    if (prismaError.code === "P2002") {
      return NextResponse.json(
        { error: "A record with this information already exists" },
        { status: 409 },
      );
    }

    if (prismaError.code === "P2025") {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
  }
  return NextResponse.json(
    {
      error:
        "Internal server error" +
        (error instanceof Error ? ": " + error.message : ""),
    },
    { status: 500 },
  );
}

export function createSuccessResponse<T>(data: T, message?: string) {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

export function createPaginatedResponse<T>(
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      ...pagination,
      hasNext: pagination.page < pagination.totalPages,
      hasPrev: pagination.page > 1,
    },
  });
}
