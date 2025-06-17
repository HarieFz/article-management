import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/crypto";

// Route berdasarkan role
const adminRoutes = ["/admin"];
const userRoutes = ["/", "/profile"];
const publicRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Ambil cookie token dan decrypt
  const cookie = (await cookies()).get("token");
  const session = cookie ? decrypt(cookie.value) : null;

  const isAuthenticated = !!session?.token;
  const isAdmin = session?.role === "Admin";
  const isUser = session?.role === "User";

  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  const isUserRoute = userRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Redirect jika user belum login
  if ((isAdminRoute || isUserRoute) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Cegah user biasa akses admin route
  if (isAdminRoute && isUser) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // Cegah admin akses user-only route
  if (isUserRoute && isAdmin) {
    return NextResponse.redirect(new URL("/admin/articles", req.nextUrl));
  }

  // Jika sudah login, cegah akses halaman public
  if (isPublicRoute && isAuthenticated) {
    const redirectPath = isAdmin ? "/admin/articles" : "/";
    return NextResponse.redirect(new URL(redirectPath, req.nextUrl));
  }

  return NextResponse.next();
}

// Jalankan hanya untuk halaman, bukan API / static files
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
