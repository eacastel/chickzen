import { Fragment } from "react";
import type { HomeBlock } from "@/lib/homepage-content";
export function HomeLines({ text }: { text: string }) {
  return text.split("\n").map((line, i) => <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>);
}
export function HomeHeading({ block }: { block: HomeBlock }) {
  return <><HomeLines text={block.heading} />{block.emphasis && <><br /><em>{block.emphasis}</em></>}</>;
}
export function HomeParagraphs({ text, className }: { text: string; className?: string }) {
  return text.split(/\n\s*\n/).filter(Boolean).map((paragraph, i) => <p className={className} key={i}><HomeLines text={paragraph} /></p>);
}
