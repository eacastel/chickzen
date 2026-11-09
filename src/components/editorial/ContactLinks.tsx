import { FaWhatsapp } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
export default function ContactLinks() {
  return (
    <div className="contact-links">
      <a href="mailto:hello@chickzen.com">
        <FiMail aria-hidden="true" />
        <span>hello@chickzen.com</span>
      </a>
      <a
        href="https://wa.me/34606989881"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Jen on WhatsApp (opens a new tab)"
      >
        <FaWhatsapp aria-hidden="true" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
