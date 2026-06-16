import { NextResponse, type NextRequest } from "next/server";

const AUDIO_HOST = "audio.jesaias.dk";

export function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();
  const pathname = request.nextUrl.pathname;

  if (
    hostname === AUDIO_HOST &&
    !pathname.startsWith("/audio") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api") &&
    !pathname.includes(".")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/audio" : `/audio${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|icon.png).*)"],
};
