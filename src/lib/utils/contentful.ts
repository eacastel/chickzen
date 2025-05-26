

export function getLocalized<T>(field: T | { [locale: string]: T } | undefined): T | undefined {
  if (field === undefined || field === null) return undefined;

  if (typeof field === "object" && "en-US" in field) {
    return (field as { [locale: string]: T })["en-US"];
  }

  return field as T;
}

export function filterResolvedEntries<T extends { sys?: unknown; fields?: unknown }>(
  items: unknown[] | undefined
): T[] {
  if (!Array.isArray(items)) return [];
  return items.filter((item): item is T => {
    return (
      typeof item === "object" &&
      item !== null &&
      "sys" in item &&
      "fields" in item
    );
  });
}

