import { NextRequest, NextResponse } from "next/server";

const ROLE_COOKIE = "riffus_role";

export function middleware(request: NextRequest) {
  const roleQuery = request.nextUrl.searchParams.get("role");
  const roleCookie = request.cookies.get(ROLE_COOKIE)?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/owner")) {
    const role = roleQuery ?? roleCookie;
    if (role !== "owner") {
      const redirectUrl = new URL("/", request.url);
      redirectUrl.searchParams.set("role", "customer");
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (roleQuery === "owner" || roleQuery === "customer") {
    const response = NextResponse.next();
    response.cookies.set(ROLE_COOKIE, roleQuery, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/owner/:path*"],
};
