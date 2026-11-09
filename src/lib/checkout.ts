import type { ServiceTypeEntry, ServiceProductEntry } from "@/types/contentful";
import { filterResolvedEntries, getLocalized } from "@/lib/utils/contentful";
import { extractNumber, type Currency } from "@/lib/utils/currency";
export function quoteServices(
  ids: unknown,
  currency: unknown,
  types: ServiceTypeEntry[],
) {
  if (currency !== "USD" && currency !== "EUR")
    throw new Error("Unsupported currency");
  if (
    !Array.isArray(ids) ||
    !ids.length ||
    ids.length > 20 ||
    ids.some((id) => typeof id !== "string") ||
    new Set(ids).size !== ids.length
  )
    throw new Error("Choose valid services");
  const products = types.flatMap(
    (type) =>
      filterResolvedEntries(
        getLocalized(type.fields.services) ?? [],
      ) as ServiceProductEntry[],
  );
  let amount = 0;
  for (const id of ids) {
    const product = products.find((p) => p.sys.id === id);
    if (!product) throw new Error("A selected service is no longer available");
    const price = extractNumber(
      currency === "USD"
        ? (product.fields.usPrice ?? product.fields.price)
        : product.fields.price,
    );
    if (!Number.isFinite(price) || price <= 0)
      throw new Error("A selected service has no valid price");
    amount += Math.round(price * 100);
  }
  if (amount > 99999999) throw new Error("Please contact Jen for this order");
  return {
    amount,
    currency: currency as Currency,
    productIds: ids as string[],
  };
}
