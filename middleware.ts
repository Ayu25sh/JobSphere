import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUser } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const user = await getUser(request);
  const { pathname } = request.nextUrl;

  // Public routes
  if (pathname.startsWith("/auth/")) {
    if (user) {
      // Redirect based on user role
      if (user.role === "jobSeeker") {
        return NextResponse.redirect(new URL("/jobs", request.url));
      } else {
        return NextResponse.redirect(new URL("/employer/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/jobs/create",
    "/applications",
    "/profile",
    "/employer",
    "/my-applications"
  ];

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    // Role-specific route protection
    if (pathname.startsWith("/employer") && user.role !== "employer") {
      return NextResponse.redirect(new URL("/jobs", request.url));
    }

    if (pathname.startsWith("/my-applications") && user.role !== "jobSeeker") {
      return NextResponse.redirect(new URL("/employer/dashboard", request.url));
    }
  }

  // Redirect root path based on user role
  if (pathname === "/" && user) {
    if (user.role === "jobSeeker") {
      return NextResponse.redirect(new URL("/jobs", request.url));
    } else {
      return NextResponse.redirect(new URL("/employer/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/auth/:path*",
    "/jobs/create",
    "/applications/:path*",
    "/profile/:path*",
    "/employer/:path*",
    "/my-applications/:path*"
  ],
};