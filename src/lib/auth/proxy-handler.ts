import { ssoAuth } from ".";
import { NextRequest, NextResponse } from "next/server";
import { buildLoginUrl } from "./utils/build-login-url";

export function proxyHandler(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (ssoAuth().config.public_routes.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get(
    ssoAuth().config.cookies.TOKEN_NAME,
  )?.value;

  if (!accessToken) {
    return NextResponse.redirect(buildLoginUrl(pathname));
  }
}
