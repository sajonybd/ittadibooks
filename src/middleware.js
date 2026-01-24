

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const protectedRoutes = ["/dashboard", "/user", "/admin","/checkout","/cart"];
const adminRoutes = ["/admin"]; // Only admins

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request) {
  const response = intlMiddleware(request);
  const { pathname, origin, search } = request.nextUrl;
  const protectedApiRoutes = ["/api/cart"];
  // Get locale
  const locale = pathname.split("/")[1];
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

   // If it's the root path, rewrite instead of redirect
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/bn';
    return NextResponse.rewrite(url); //  Rewrites internally (no redirect)
  }
  // Auth check
  const isProtected = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  // Check if it's a protected page route
  const isProtectedPage = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // Check if it's a protected API route
  const isProtectedApi = protectedApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if ((isProtectedPage || isProtectedApi) && !token) {
    // If it's an API call → return JSON 401
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Otherwise → redirect to login
    const loginUrl = new URL(`/${locale}/login`, origin);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtected && !token) {
    const loginUrl = new URL(`/${locale}/login`, origin);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // Admin role check
  const isAdminRoute = adminRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  if (isAdminRoute && token?.role !== "admin") {
    // Redirect non-admins to 403 page or home
    return NextResponse.redirect(new URL(`/${locale}/403`, origin));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
