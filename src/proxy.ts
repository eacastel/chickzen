import { NextResponse, type NextRequest } from "next/server";
import { isPublicProduction } from "@/lib/deployment";
import { allowedOrigin } from "@/lib/analytics/policy";
import { legacyDestination } from "@/lib/legacy-routes";

export function proxy(request: NextRequest) {
  const destination = legacyDestination(new URL(request.url));
  const response = destination ? NextResponse.redirect(destination, 308) : NextResponse.next();
  if (!isPublicProduction() || !allowedOrigin(new URL(request.url).origin)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
