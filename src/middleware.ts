import { NextRequest, NextResponse } from "next/server";
import { getSession, getTokenPayload } from "./lib/session/server";
import { DEMO_CONFIG } from "./config/demo.config";

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};

const publicRoutes = ["/login", "/unauthorized"];

const excludedExtensions =
  /\.(png|jpg|jpeg|gif|svg|webp|ico|ttf|woff|woff2|eot|otf|css|js|map|json)$/;

interface IAuthUser {
  pagina_inicial?: string;
}

export default async function middleware(request: NextRequest) {
  "use server";

  const url = request.nextUrl.pathname;

  if (DEMO_CONFIG.disableAuth) {
    return NextResponse.next();
  }

  if (
    url.startsWith("/api") ||
    url.startsWith("/_next/static") ||
    url.startsWith("/_next/image") ||
    url.startsWith("/docs") ||
    url.startsWith("/changelog") ||
    url === "/favicon.ico" ||
    url === "/sitemap.xml" ||
    url === "/robots.txt" ||
    url === "/unauthorized" ||
    excludedExtensions.test(url)
  ) {
    return NextResponse.next();
  }

  const token = await getTokenPayload(request);
  const session = await getSession(request);
  const authUser = session?.data?.user as IAuthUser | undefined;

  const routerName: string = request.nextUrl.pathname;

  if (process.env.APP_ENV !== "production") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }
  const isPublicRoute = publicRoutes.includes(routerName);

  if (!token || !session) {
    if (isPublicRoute) {
      return NextResponse.next();
    }

    const urlNext = request.nextUrl.clone();
    urlNext.pathname = "/login";
    return NextResponse.redirect(urlNext);
  }

  if (routerName.includes("/login") && token) {
    const urlNext = request.nextUrl.clone();
    const initialPage = authUser?.pagina_inicial?.trim();
    urlNext.pathname = initialPage
      ? initialPage.startsWith("/")
        ? initialPage
        : `/${initialPage}`
      : "/";
    return NextResponse.redirect(urlNext);
  }

  return NextResponse.next();
}
