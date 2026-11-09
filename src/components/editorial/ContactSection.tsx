import ContactLinks from "./ContactLinks";
import InquiryForm from "./InquiryForm";
import { emailDeliveryReady, newsletterReady } from "@/lib/inquiry";
export default function ContactSection({
  standalone = false,
}: {
  standalone?: boolean;
}) {
  const Heading = standalone ? "h1" : "h2";
  return (
    <section
      className="wrap begin contact-panel"
      id="begin"
      aria-labelledby="begin-title"
    >
      <div>
        <span className="eyebrow">
          Your next chapter starts with a conversation
        </span>
        <Heading id="begin-title">
          Let’s find your
          <br />
          <em>next right step.</em>
        </Heading>
        <p>
          Tell Jen a little about your business, what’s changing, and what you’d
          like help with. We can start there.
        </p>
        <ContactLinks />
      </div>
      <InquiryForm
        enabled={emailDeliveryReady()}
        newsletterAvailable={newsletterReady()}
      />
    </section>
  );
}
