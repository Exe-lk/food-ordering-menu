// app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // If it's an OPTIONS request, return early with the headers.
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
