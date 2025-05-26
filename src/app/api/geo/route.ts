// src/app/api/geo/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Netlify sends a header named `x-nf-geo` whose value is a JSON string
  const rawHeader = request.headers.get("x-nf-geo") ?? "{}";

  // Narrow the type of what we expect after JSON.parse
  interface NetlifyGeoHeader {
    country?: string;
    region?: string;
    city?: string;
    latitude?: string;
    longitude?: string;
    [key: string]: unknown;   // allow other keys without using `any`
  }

  let geo: NetlifyGeoHeader;

  try {
    geo = JSON.parse(rawHeader) as NetlifyGeoHeader;
  } catch {
    geo = {};
  }

  return NextResponse.json({ geo });
}
