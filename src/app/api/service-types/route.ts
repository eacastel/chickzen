// src/app/api/service-types/route.ts

import { NextResponse } from "next/server";
import { getAllServiceTypes } from "@/lib/contentful";

export async function GET() {
  const serviceTypes = await getAllServiceTypes();
  return NextResponse.json(serviceTypes, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
