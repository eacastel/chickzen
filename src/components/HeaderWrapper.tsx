// server component
import { getHeaderImage, getMenuByName } from "@/lib/contentful";
import type { HeaderImageEntry, MenuItemEntry } from "@/types/contentful";
import HeaderClient from "./HeaderClient";

export default async function HeaderWrapper() {
  const headerImage = (await getHeaderImage()) as HeaderImageEntry;
  const menu       = (await getMenuByName("Main Navigation"))!;
  const menuItems = Array.isArray(menu?.fields?.menuItems)
  ? (menu.fields.menuItems as MenuItemEntry[])
  : [];

  return <HeaderClient headerImage={headerImage} menuItems={menuItems} />;
}
