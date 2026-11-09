"use client";
import { useEffect, useRef, useState } from "react";
import { inquiryTopics } from "@/lib/inquiry-topics";
import Link from "next/link";

export default function InquiryForm({
  enabled,
  newsletterAvailable,
}: {
  enabled: boolean;
  newsletterAvailable: boolean;
}) {
  const [pending, setPending] = useState(false),
    [status, setStatus] = useState(""),
    [accepted, setAccepted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const service = new URLSearchParams(window.location.search).get("service");
    const message = formRef.current?.elements.namedItem("message");
    if (service && message instanceof HTMLTextAreaElement && !message.value)
      message.value = `I’d like to learn more about ${service.slice(0, 160)}. `;
  }, []);
  const submissionId = useRef("");
  const submittedPayload = useRef("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget,
      values = new FormData(form);
    const fields = {
      name: values.get("name"),
      email: values.get("email"),
      business: values.get("business") || "",
      topic: values.get("topic"),
      message: values.get("message"),
      website: values.get("website") || "",
      newsletter: values.get("newsletter") === "yes",
    };
    const fingerprint = JSON.stringify(fields);
    if (!submissionId.current || submittedPayload.current !== fingerprint) {
      submissionId.current = crypto.randomUUID();
      submittedPayload.current = fingerprint;
    }
    setPending(true);
    setStatus("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, submissionId: submissionId.current }),
      });
      const result = await response.json();
      if (!response.ok || result.accepted !== true)
        throw new Error(
          result.error || "Please try again or email Jen directly.",
        );
      setAccepted(true);
      setStatus(
        result.newsletterWarning
          ? "Your inquiry is on its way to Jen. We couldn’t add you to email updates; mention this when Jen replies."
          : "Thank you. Your inquiry is on its way to Jen.",
      );
      form.reset();
      submissionId.current = "";
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Please try again or email Jen directly.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <form
      ref={formRef}
      className="contact-form"
      onSubmit={submit}
      aria-label="Consulting inquiry"
      aria-busy={pending}
    >
      <label>
        Your name
        <input
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
        />
      </label>
      <label>
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
        />
      </label>
      <label>
        Business or website <span>(optional)</span>
        <input name="business" autoComplete="organization" maxLength={160} />
      </label>
      <label>
        What would you like help with?
        <select name="topic" required defaultValue="">
          <option value="" disabled>
            Choose a starting point
          </option>
          {inquiryTopics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </label>
      <label>
        Tell Jen a little about what’s next
        <textarea
          name="message"
          required
          minLength={20}
          maxLength={5000}
          rows={5}
        />
      </label>
      <div className="form-trap" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {newsletterAvailable && (
        <label className="form-consent">
          <input name="newsletter" type="checkbox" value="yes" />
          I’d also like occasional ideas and updates from Jen. I can unsubscribe
          at any time.
        </label>
      )}
      <p className="form-note">
        Jen will use these details to respond to your inquiry.{" "}
        <Link href="/privacy-policy" className="text-link">
          Privacy policy
        </Link>
      </p>
      {!enabled && (
        <p className="form-note">
          Please email Jen directly while the form is unavailable.
        </p>
      )}
      <button
        className="button"
        type="submit"
        disabled={!enabled || pending || accepted}
      >
        {pending
          ? "Sending…"
          : accepted
            ? "Inquiry submitted"
            : "Send your inquiry"}
        <span className="arrow" aria-hidden="true">
          ↗
        </span>
      </button>
      <div role="status" aria-live="polite">
        {status && <p className="form-status">{status}</p>}
      </div>
    </form>
  );
}
