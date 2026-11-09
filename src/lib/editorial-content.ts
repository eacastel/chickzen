import type { Document } from "@contentful/rich-text-types";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";

export function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}
export function fields(value: unknown) {
  return record(record(value).fields);
}
export function text(value: unknown) {
  return typeof value === "string" ? value : "";
}
export function entries(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}
export function entryId(value: unknown) {
  return text(record(record(value).sys).id);
}
export function contentType(value: unknown) {
  return text(record(record(record(record(value).sys).contentType).sys).id);
}
export function richDocument(value: unknown): Document | undefined {
  const candidate = record(value);
  return candidate.nodeType === "document" && Array.isArray(candidate.content)
    ? (value as Document)
    : undefined;
}
export function asset(value: unknown) {
  const f = fields(value),
    file = record(f.file),
    size = record(record(file.details).image);
  const url = text(file.url);
  return {
    url: url.startsWith("//") ? `https:${url}` : url,
    title: text(f.description) || text(f.title),
    width: typeof size.width === "number" ? size.width : 1200,
    height: typeof size.height === "number" ? size.height : 800,
    type: text(file.contentType),
  };
}
/** Keep Chickzen links on this deployment; reject executable URL schemes. */
export function localHref(value: unknown): string {
  const href = text(value).trim();
  if (!href) return "/contact";
  if (/^(?:mailto:|tel:|#)/i.test(href)) return href;
  try {
    const url = new URL(
      href.startsWith("//") ? `https:${href}` : href,
      "https://chickzen.com/",
    );
    if (!["https:", "http:"].includes(url.protocol)) return "/contact";
    if (["chickzen.com", "www.chickzen.com"].includes(url.hostname))
      return `${url.pathname}${url.search}${url.hash}`;
    return url.href;
  } catch {
    return "/contact";
  }
}
export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  rating?: number;
};
export function reviewsFromGroup(group: unknown): Testimonial[] {
  return entries(fields(group).reviewBlocks).flatMap((entry) => {
    const f = fields(entry),
      body = richDocument(f.body);
    const quote = body
      ? documentToPlainTextString(body)
          .trim()
          .replace(/^[¨“”"\s]+|[¨“”"\s]+$/g, "")
      : "";
    if (!quote || !text(f.label)) return [];
    const rating =
      typeof f.rating === "number" &&
      Number.isInteger(f.rating) &&
      f.rating >= 1 &&
      f.rating <= 5
        ? f.rating
        : undefined;
    return [{ id: entryId(entry), quote, name: text(f.label), rating }];
  });
}
export function reviewsFromPage(page: unknown): Testimonial[] {
  const all = entries(fields(page).section)
    .filter((e) => contentType(e) === "reviewBlockGroup")
    .flatMap(reviewsFromGroup);
  return all.filter(
    (review, i) => all.findIndex((r) => r.id === review.id) === i,
  );
}
