import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma/client";
import { securityMiddleware } from "@/lib/middleware/security";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/config/env";
import axios from "axios";
import { verifyGoogleIdToken } from "@/helpers/googleverify";

export async function GET(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const searchParams = request.nextUrl.searchParams;
      const code = searchParams.get("code");
      const stateParam = searchParams.get("state");

      let type = "organizer";
      let slug = "";

      if (stateParam) {
        try {
          const stateObj = JSON.parse(decodeURIComponent(stateParam));
          type = stateObj.type || "organizer";
          slug = stateObj.slug || "";
        } catch (e) {
          console.error("Failed to parse state param:", e);
        }
      }

      const errorRedirect = type === "attendee" ? `/checkin/${slug}?error=OAuth failed` : "/auth?error=OAuth failed";

      if (!code) {
        return NextResponse.redirect(`${env.FRONTEND_URL}${errorRedirect}`);
      }

      const params = new URLSearchParams();
      params.append("client_id", env.GOOGLE_CLIENT_ID);
      params.append("client_secret", env.GOOGLE_CLIENT_SECRET);
      params.append("redirect_uri", `${env.FRONTEND_URL}/api/auth/google/callback`);
      params.append("grant_type", "authorization_code");
      params.append("code", code);

      const tokenRes = await axios.post("https://oauth2.googleapis.com/token", params.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { id_token } = tokenRes.data;
      if (!id_token) throw new Error("No id_token returned from Google");
      const googleUser = await verifyGoogleIdToken(id_token);

      if (!googleUser || !googleUser.email) {
        return NextResponse.redirect(`${env.FRONTEND_URL}${errorRedirect}`);
      }

      if (type === "attendee" && slug) {
        // Handle Attendee (Check-in)
        const checkinPage = await prisma.checkInPage.findUnique({
          where: { slug },
        });

        if (!checkinPage) {
          return NextResponse.redirect(`${env.FRONTEND_URL}/404`);
        }

        // Create or find attendee globally by email
        let attendee = await prisma.attendee.findFirst({
          where: { email: googleUser.email },
        });

        if (!attendee) {
          attendee = await prisma.attendee.create({
            data: {
              email: googleUser.email,
              fullName: googleUser.name || "",
              picture: googleUser.picture,
            },
          });
        } else {
          // Update details from Google if they have changed
          attendee = await prisma.attendee.update({
            where: { id: attendee.id },
            data: {
              fullName: googleUser.name || attendee.fullName,
              picture: googleUser.picture || attendee.picture,
            },
          });
        }

        const sessionCode = uuidv4();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await prisma.sessionCode.create({
          data: {
            code: sessionCode,
            email: googleUser.email,
            expiresAt,
            used: false,
          },
        });

        return NextResponse.redirect(`${env.FRONTEND_URL}/checkin/${slug}?session_code=${sessionCode}`);
      } else {
        // Handle Organizer (Dashboard Login)
        let user = await prisma.organizer.findFirst({
          where: { email: googleUser.email },
        });

        if (!user) {
          user = await prisma.organizer.create({
            data: {
              email: googleUser.email,
              name: googleUser.name,
              picture: googleUser.picture,
            },
          });
        } else {
          // Update name and picture if they changed
          user = await prisma.organizer.update({
            where: { id: user.id },
            data: {
              name: googleUser.name,
              picture: googleUser.picture,
            },
          });
        }

        const sessionCode = uuidv4();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await prisma.sessionCode.create({
          data: {
            code: sessionCode,
            email: user.email,
            expiresAt,
            used: false,
          },
        });

        return NextResponse.redirect(`${env.FRONTEND_URL}/auth?session_code=${sessionCode}`);
      }
    } catch (err: any) {
      console.error("Google OAuth callback failed:", err);
      return NextResponse.redirect(`${env.FRONTEND_URL}/auth?error=OAuth failed`);
    }
  });
}
