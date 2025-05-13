import type {
  Entry,
  Asset,
  ChainModifiers,
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

export interface ReviewBlockFields {
  title?: EntryFieldTypes.Text;
  showTitle?: EntryFieldTypes.Boolean;
  body: EntryFieldTypes.RichText;
  rating?: EntryFieldTypes.Number;
  label?: EntryFieldTypes.Text;
}
export type ReviewBlockSkeleton = EntrySkeletonType<ReviewBlockFields>;
export type ReviewBlockEntry = Entry<ReviewBlockSkeleton>;

export interface ReviewBlockGroupFields {
  title?: EntryFieldTypes.Text;
  reviewBlocks: Entry<ReviewBlockSkeleton>[];
}
export type ReviewBlockGroupSkeleton = EntrySkeletonType<ReviewBlockGroupFields>;
export type ReviewBlockGroupEntry = Entry<ReviewBlockGroupSkeleton>;

export interface LogoCarouselFields {
  title?: EntryFieldTypes.Text;
  logos: Asset<ChainModifiers, string>[];
}
export type LogoCarouselSkeleton = EntrySkeletonType<LogoCarouselFields>;
export type LogoCarouselEntry = Entry<LogoCarouselSkeleton>;

export interface HighlightBlockFields {
  title?: EntryFieldTypes.Text;
  items: (Entry<ImageBannerSkeleton> | Entry<CallToActionSkeleton>)[];
}
export type HighlightBlockSkeleton = EntrySkeletonType<HighlightBlockFields>;
export type HighlightBlockEntry = Entry<HighlightBlockSkeleton>;

export interface ImageBannerFields {
  title?: EntryFieldTypes.Text;
  image: Asset;
}
export type ImageBannerSkeleton = EntrySkeletonType<ImageBannerFields>;
export type ImageBannerEntry = Entry<ImageBannerSkeleton>;

export interface CallToActionFields {
  backgroundImage?: Asset;
  body: EntryFieldTypes.RichText;
  buttonLabel?: EntryFieldTypes.Text;
  buttonLink?: EntryFieldTypes.Text;
}
export type CallToActionSkeleton = EntrySkeletonType<CallToActionFields>;
export type CallToActionEntry = Entry<CallToActionSkeleton>;
