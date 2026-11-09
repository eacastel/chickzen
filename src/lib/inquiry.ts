import { inquiryTopics } from "./inquiry-topics";
export type Inquiry = {
  name: string;
  email: string;
  business: string;
  topic: string;
  message: string;
  newsletter: boolean;
  submissionId: string;
  website?: string;
};
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
export function validEmail(value: string) {
  return (
    value.length <= 254 && emailPattern.test(value) && !/[\r\n]/.test(value)
  );
}
export function validateInquiry(value: unknown): Inquiry | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (
    ["name", "email", "business", "topic", "message", "submissionId"].some(
      (k) => typeof v[k] !== "string",
    )
  )
    return null;
  const name = (v.name as string).trim(),
    email = (v.email as string).trim(),
    business = (v.business as string).trim(),
    topic = v.topic as string,
    message = (v.message as string).trim();
  if (
    name.length < 2 ||
    name.length > 100 ||
    /[\r\n<>]/.test(name) ||
    !validEmail(email) ||
    business.length > 160 ||
    message.length < 20 ||
    message.length > 5000 ||
    !inquiryTopics.some((t) => t === topic)
  )
    return null;
  if (
    !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(
      v.submissionId as string,
    )
  )
    return null;
  if (v.newsletter !== undefined && typeof v.newsletter !== "boolean")
    return null;
  if (
    v.website !== undefined &&
    (typeof v.website !== "string" || v.website.length > 0)
  )
    return null;
  return {
    name,
    email,
    business,
    topic,
    message,
    newsletter: v.newsletter === true,
    submissionId: v.submissionId as string,
  };
}
export function emailDeliveryReady() {
  return (
    process.env.EMAIL_DELIVERY_ENABLED === "true" &&
    !!process.env.RESEND_API_KEY &&
    validEmail(process.env.CONTACT_EMAIL_FROM || "") &&
    validEmail(process.env.CONTACT_EMAIL_TO || "")
  );
}
export function newsletterReady() {
  return !!process.env.MAILERLITE_API_KEY && !!process.env.MAILERLITE_GROUP_ID;
}
export async function deliverInquiry(inquiry: Inquiry) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `chickzen-inquiry/${inquiry.submissionId}`,
    },
    body: JSON.stringify({
      from: `chickzen <${process.env.CONTACT_EMAIL_FROM}>`,
      to: [process.env.CONTACT_EMAIL_TO],
      reply_to: inquiry.email,
      subject: `Chickzen inquiry: ${inquiry.topic}`,
      text: [
        `Name: ${inquiry.name}`,
        `Email: ${inquiry.email}`,
        `Business: ${inquiry.business || "Not provided"}`,
        `Interested in: ${inquiry.topic}`,
        "",
        inquiry.message,
        "",
        `Newsletter opt-in: ${inquiry.newsletter ? "Yes" : "No"}`,
      ].join("\n"),
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok)
    throw new Error(`Email provider returned ${response.status}`);
  const data = await response.json();
  if (typeof data.id !== "string" || !data.id.trim())
    throw new Error("Email provider did not acknowledge submission");
}
export async function subscribeToUpdates(inquiry: Inquiry) {
  if (!inquiry.newsletter) return;
  if (!newsletterReady()) throw new Error("Newsletter is not configured");
  const response = await fetch(
    "https://connect.mailerlite.com/api/subscribers",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: inquiry.email,
        fields: { name: inquiry.name },
        groups: [process.env.MAILERLITE_GROUP_ID],
        opted_in_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      }),
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok)
    throw new Error(`Newsletter provider returned ${response.status}`);
  // Existing unsubscribed/bounced contacts are never forcibly reactivated.
}
