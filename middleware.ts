import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_KEY, ROLE_KEY } from "@/lib/config";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(TOKEN_KEY)?.value;
  const role = req.cookies.get(ROLE_KEY)?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isMemberRoute = pathname.startsWith("/member");

  if (!isAdminRoute && !isMemberRoute) return NextResponse.next();

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && role !== "admin_space") {
    const url = req.nextUrl.clone();
    url.pathname = "/member/dashboard";
    return NextResponse.redirect(url);
  }

  if (isMemberRoute && role !== "member") {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/member/:path*"],
};
