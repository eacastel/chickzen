import InquiryForm from "./InquiryForm";
import { emailDeliveryReady, newsletterReady } from "@/lib/inquiry";
export default function ContactSection() {
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
        <h2 id="begin-title">
          Let’s find your
          <br />
          <em>next right step.</em>
        </h2>
        <p>
          Tell Jen a little about your business, what’s changing, and what you’d
          like help with. We can start there.
        </p>
        <a className="begin-email" href="mailto:hello@chickzen.com">
          Prefer email? hello@chickzen.com
        </a>
      </div>
      <InquiryForm
        enabled={emailDeliveryReady()}
        newsletterAvailable={newsletterReady()}
      />
    </section>
  );
}
