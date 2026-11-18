import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";

export const runtime = "nodejs";
const topics = new Set([
  "ContentManagement.Entry.publish", "ContentManagement.Entry.unpublish", "ContentManagement.Entry.delete",
  "ContentManagement.Asset.publish", "ContentManagement.Asset.unpublish", "ContentManagement.Asset.delete",
]);
function reply(body: object, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Contentful sends only publication events and entity IDs, never form data. */
export async function POST(request: Request) {
  const secret = process.env.CONTENTFUL_REVALIDATE_SECRET;
  if (!secret || secret.length < 32) return reply({ error: "Not configured" }, 503);
  const supplied = request.headers.get("x-chickzen-revalidate-secret") || "";
  const expectedBytes = Buffer.from(secret), suppliedBytes = Buffer.from(supplied);
  if (expectedBytes.length !== suppliedBytes.length || !timingSafeEqual(expectedBytes, suppliedBytes))
    return reply({ error: "Unauthorized" }, 401);
  if (!topics.has(request.headers.get("x-contentful-topic") || ""))
    return reply({ revalidated: false, reason: "Not a publication event" }, 202);
  if (Number(request.headers.get("content-length")) > 8192) return reply({ error: "Too large" }, 413);
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 8192) return reply({ error: "Too large" }, 413);
    const payload = JSON.parse(raw);
    if (!payload || typeof payload.id !== "string" || !payload.id ||
      payload.spaceId !== process.env.CONTENTFUL_SPACE_ID ||
      payload.environmentId !== (process.env.CONTENTFUL_ENVIRONMENT || "master"))
      return reply({ error: "Unexpected content source" }, 400);
  } catch {
    return reply({ error: "Invalid JSON" }, 400);
  }
  revalidateTag("contentful", { expire: 0 });
  revalidatePath("/", "layout");
  return reply({ revalidated: true });
}
