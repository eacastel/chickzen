import { homeBlock, type HomeBlock } from "@/lib/homepage-content";
import { HomeHeading, HomeParagraphs } from "./HomeText";
import ContactLinks from "./ContactLinks";
import InquiryForm from "./InquiryForm";
import { emailDeliveryReady, newsletterReady } from "@/lib/inquiry";
export default function ContactSection({
  standalone = false,
  copy = homeBlock(null, "contact"),
}: {
  standalone?: boolean;
  copy?: HomeBlock;
}) {
  const Heading = standalone ? "h1" : "h2";
  return (
    <section
      className="wrap begin contact-panel"
      id="begin"
      aria-labelledby="begin-title"
    >
      <div>
        <span className="eyebrow">{copy.eyebrow}</span>
        <Heading id="begin-title"><HomeHeading block={copy} /></Heading>
        <HomeParagraphs text={copy.body} />
        <ContactLinks />
      </div>
      <InquiryForm
        enabled={emailDeliveryReady()}
        newsletterAvailable={newsletterReady()}
      />
    </section>
  );
}
