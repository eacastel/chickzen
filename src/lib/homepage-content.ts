import defaults from "./homepage-defaults.json";
import { asset, contentType, entries, entryId, fields, text } from "./editorial-content";

export type HomeBlockKey = keyof typeof defaults;
export type HomeBlock = {
  name: string; eyebrow: string; heading: string; emphasis: string; body: string;
  label: string; summary: string; primaryLabel: string; primaryLink: string;
  secondaryLabel: string; secondaryLink: string; imageAlt: string;
  image?: ReturnType<typeof asset>;
};
const empty: HomeBlock = { name: "", eyebrow: "", heading: "", emphasis: "", body: "",
  label: "", summary: "", primaryLabel: "", primaryLink: "", secondaryLabel: "",
  secondaryLink: "", imageAlt: "" };

export function homeBlock(page: unknown, key: HomeBlockKey): HomeBlock {
  const result: HomeBlock = { ...empty, ...defaults[key] };
  const entry = entries(fields(page).homepageContent).find(
    (item) => entryId(item) === `homepage-${key}` && contentType(item) === "homepageBlock",
  );
  const values = fields(entry);
  for (const field of Object.keys(empty) as (keyof typeof empty)[]) {
    if (field !== "image" && typeof values[field] === "string") result[field] = values[field];
  }
  const image = asset(values.image);
  if (image.type.startsWith("image/") && image.url.startsWith("https://images.ctfassets.net/")) result.image = image;
  return result;
}

export type ClientLogo = { id: string; name: string; url: string; width: number; height: number };
export function homeLogos(page: unknown): { title: string; logos: ClientLogo[] } {
  const group = entries(fields(page).section).find((item) => contentType(item) === "logoCarousel");
  const seen = new Set<string>();
  const logos = entries(fields(group).logos).flatMap((item) => {
    const image = asset(item), id = entryId(item);
    if (!id || seen.has(id) || !image.type.startsWith("image/") || !image.url.startsWith("https://images.ctfassets.net/")) return [];
    seen.add(id);
    return [{ id, name: text(fields(item).title).trim() || image.title, url: image.url, width: image.width, height: image.height }];
  });
  return { title: text(fields(group).title) || "Our clients", logos };
}
