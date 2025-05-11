import type {
  Entry,
  Asset,
  EntrySkeletonType,
  EntryFieldTypes,
} from 'contentful'

export interface HeroFields {
  title: EntryFieldTypes.Text
  byline: EntryFieldTypes.Text
  image: Asset
}

export type HeroSkeleton = EntrySkeletonType<HeroFields>
export type HeroEntry = Entry<HeroSkeleton>

export interface SectionFields {
  title: EntryFieldTypes.Text
  byline?: EntryFieldTypes.Text
  body?: EntryFieldTypes.RichText
  image?: Asset
  imageAlt?: EntryFieldTypes.Text
  imagePosition?: EntryFieldTypes.Text
  showTitle?: boolean
}
export type SectionSkeleton = EntrySkeletonType<SectionFields>
export type SectionEntry = Entry<SectionSkeleton>

export interface MenuItemFields {
  title: EntryFieldTypes.Text
  href: EntryFieldTypes.Text
}
export type MenuItemSkeleton = EntrySkeletonType<MenuItemFields>
export type MenuItemEntry = Entry<MenuItemSkeleton>

export interface MenuFields {
  menuName: EntryFieldTypes.Text
  menuItems: Entry<MenuItemSkeleton>[]
}
export type MenuSkeleton = EntrySkeletonType<MenuFields>
export type MenuEntry = Entry<MenuSkeleton>

export interface HeaderImageFields {
  title: string;
  image: Asset;
}
export type HeaderImageSkeleton = EntrySkeletonType<HeaderImageFields>
export type HeaderImageEntry = Entry<HeaderImageSkeleton>

