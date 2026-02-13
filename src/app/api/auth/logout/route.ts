import { NextRequest } from "next/server";
import { createSuccessResponse } from "@/lib/errors";

export async function POST(request: NextRequest) {
  // Clear the httpOnly token cookie set at login/register
  const response = createSuccessResponse({}, "Logged out");
  response.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });

  return response;
}
