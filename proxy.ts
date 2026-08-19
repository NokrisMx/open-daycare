import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/kids\/([^/]+)$/);

  if (match && !/^[1-8]$/.test(match[1])) {
    return NextResponse.rewrite(new URL("/kids/__invalid", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/kids/:id",
};
