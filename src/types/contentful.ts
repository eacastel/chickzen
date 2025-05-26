import type {
  Asset,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  ChainModifiers,
} from "contentful";

/* -------------------------------------------------------------------------- */
/*  GLOBAL NOTES                                                              */
/* -------------------------------------------------------------------------- */
/**
 * – All interfaces use Contentful’s canonical field types     (`EntryFieldTypes.*`)
 * – Use optional (`?:`) ONLY when the field is not required in the Contentful UI
 * – Never export `any` – if you truly need “any rich text”, use `EntryFieldTypes.RichText`
 * – ALWAYS end with:
 *      export type FooSkeleton = EntrySkeletonType<FooFields, "contentTypeId">
 *      export type FooEntry    = Entry<FooSkeleton>
 *   (The second generic in `EntrySkeletonType` is optional; include it when you
 *    want compile-time validation of the Contentful “Content-Type ID”.)
 */

/* -------------------------------------------------------------------------- */
/*  HERO                                                                      */
/* -------------------------------------------------------------------------- */
/** Single full-width hero section at the top of landing pages */
export interface HeroFields {
  /** Main headline */
  title:  EntryFieldTypes.Text;
  /** Subtitle / tagline */
  byline: EntryFieldTypes.Text;
  /** Background or feature image */
  image:  Asset;
}
export type HeroSkeleton = EntrySkeletonType<HeroFields, "hero">;
export type HeroEntry    = Entry<HeroSkeleton>;

/* -------------------------------------------------------------------------- */
/*  HEADER & NAVIGATION                                                       */
/* -------------------------------------------------------------------------- */
/** Logo + alt text used in the sticky header */
export interface HeaderImageFields {
  title: string;       // plain string is fine here
  image: Asset;
}
export type HeaderImageSkeleton = EntrySkeletonType<HeaderImageFields, "headerImage">;
export type HeaderImageEntry    = Entry<HeaderImageSkeleton>;

/** Single menu link */
export interface MenuItemFields {
  title: EntryFieldTypes.Text;
  href:  EntryFieldTypes.Text;
  /** Optional numeric sortOrder so you can re-sort without drag-drop */
  sortOrder?: EntryFieldTypes.Integer;
}
export type MenuItemSkeleton = EntrySkeletonType<MenuItemFields, "menuItem">;
export type MenuItemEntry    = Entry<MenuItemSkeleton>;

/** A collection of MenuItem entries (header, footer, user menu, etc.) */
export interface MenuFields {
  menuName:  EntryFieldTypes.Text;
  menuItems: Entry<MenuItemSkeleton>[];         // reference array
}
export type MenuSkeleton = EntrySkeletonType<MenuFields, "menu">;
export type MenuEntry    = Entry<MenuSkeleton>;

/* -------------------------------------------------------------------------- */
/*  SECTIONS (generic page blocks)                                            */
/* -------------------------------------------------------------------------- */
export interface SectionFields {
  title:         EntryFieldTypes.Text;
  byline?:       EntryFieldTypes.Text;
  body?:         EntryFieldTypes.RichText;
  image?:        Asset;
  imageAlt?:     EntryFieldTypes.Text;
  imagePosition?:EntryFieldTypes.Text;     // "float-left" | "float-right" | etc.
  showTitle?:    EntryFieldTypes.Boolean;  // default true in renderer
}
export type SectionSkeleton = EntrySkeletonType<SectionFields, "section">;
export type SectionEntry    = Entry<SectionSkeleton>;

/* -------------------------------------------------------------------------- */
/*  REVIEW BLOCKS                                                             */
/* -------------------------------------------------------------------------- */
export interface ReviewBlockFields {
  title?:     EntryFieldTypes.Text;
  showTitle?: EntryFieldTypes.Boolean;
  body:       EntryFieldTypes.RichText;
  rating?:    EntryFieldTypes.Number;   // 1-5 stars, etc.
  label?:     EntryFieldTypes.Text;     // e.g. “CEO, Acme Corp”
}
export type ReviewBlockSkeleton = EntrySkeletonType<ReviewBlockFields, "reviewBlock">;
export type ReviewBlockEntry    = Entry<ReviewBlockSkeleton>;

export interface ReviewBlockGroupFields {
  title?:        EntryFieldTypes.Text;
  reviewBlocks:  Entry<ReviewBlockSkeleton>[];
}
export type ReviewBlockGroupSkeleton = EntrySkeletonType<ReviewBlockGroupFields, "reviewBlockGroup">;
export type ReviewBlockGroupEntry    = Entry<ReviewBlockGroupSkeleton>;

/* -------------------------------------------------------------------------- */
/*  LOGO CAROUSEL                                                             */
/* -------------------------------------------------------------------------- */
export interface LogoCarouselFields {
  title?: EntryFieldTypes.Text;
  logos:  Asset<ChainModifiers, string>[];  // array of images
}
export type LogoCarouselSkeleton = EntrySkeletonType<LogoCarouselFields, "logoCarousel">;
export type LogoCarouselEntry    = Entry<LogoCarouselSkeleton>;

/* -------------------------------------------------------------------------- */
/*  HIGHLIGHT BLOCK + CHILD TYPES                                             */
/* -------------------------------------------------------------------------- */
export interface ImageBannerFields {
  title?: EntryFieldTypes.Text;
  image:  Asset;
}
export type ImageBannerSkeleton = EntrySkeletonType<ImageBannerFields, "imageBanner">;
export type ImageBannerEntry    = Entry<ImageBannerSkeleton>;

export interface CallToActionFields {
  backgroundImage?: Asset;
  body:             EntryFieldTypes.RichText;
  buttonLabel?:     EntryFieldTypes.Text;
  buttonLink?:      EntryFieldTypes.Text;
}
export type CallToActionSkeleton = EntrySkeletonType<CallToActionFields, "callToAction">;
export type CallToActionEntry    = Entry<CallToActionSkeleton>;

/** A wrapper that can contain ImageBanner or CallToAction children */
export interface HighlightBlockFields {
  title?: EntryFieldTypes.Text;
  items:  (Entry<ImageBannerSkeleton> | Entry<CallToActionSkeleton>)[];
}
export type HighlightBlockSkeleton = EntrySkeletonType<HighlightBlockFields, "highlightBlock">;
export type HighlightBlockEntry    = Entry<HighlightBlockSkeleton>;

/* -------------------------------------------------------------------------- */
/*  SERVICE / PRODUCT CHECKOUT                                                */
/* -------------------------------------------------------------------------- */
export interface ServiceProductFields {
  title:       EntryFieldTypes.Text;
  description: EntryFieldTypes.Text | EntryFieldTypes.RichText;
  price: EntryFieldTypes.Number;      // ← EUR price (default)
  usPrice?: EntryFieldTypes.Number;   // ← USD price
}
export type ServiceProductSkeleton = EntrySkeletonType<ServiceProductFields, "serviceProduct">;
export type ServiceProductEntry    = Entry<ServiceProductSkeleton>;

export interface ServiceTypeFields {
  title:      EntryFieldTypes.Text;
  byline:     EntryFieldTypes.Text;
  services:   EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ServiceProductSkeleton>>;
  sortOrder:  EntryFieldTypes.Integer;
}
export type ServiceTypeSkeleton = EntrySkeletonType<ServiceTypeFields, "serviceType">;
export type ServiceTypeEntry    = Entry<ServiceTypeSkeleton>;

export interface ServiceOverviewBlockFields {
  serviceTypes: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ServiceTypeSkeleton>>;
}
export type ServiceOverviewBlockSkeleton = EntrySkeletonType<ServiceOverviewBlockFields, "serviceOverviewBlock">;
export type ServiceOverviewBlockEntry    = Entry<ServiceOverviewBlockSkeleton>;

/* -------------------------------------------------------------------------- */
/*  BLOG                                                                      */
/* -------------------------------------------------------------------------- */
export interface BlogPostFields {
  title?:        EntryFieldTypes.Text;
  slug?:         EntryFieldTypes.Symbol;
  byline?:       EntryFieldTypes.Symbol;
  tags?:         EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  metaTitle?:    EntryFieldTypes.Text;
  metaSummary?:  EntryFieldTypes.Symbol;
  body:          EntryFieldTypes.RichText;
  coverImage:    Asset;
  imagePosition?:EntryFieldTypes.Symbol;  // "left" | "right"
  publishDate?:  EntryFieldTypes.Date;
}
export type BlogPostSkeleton = EntrySkeletonType<BlogPostFields, "blogPost">;
export type BlogPostEntry    = Entry<BlogPostSkeleton>;
