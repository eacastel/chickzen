import {
  deliverInquiry,
  emailDeliveryReady,
  newsletterReady,
  subscribeToUpdates,
  validateInquiry,
} from "@/lib/inquiry";
import { isPublicProduction } from "@/lib/deployment";
import { allowedOrigin, validContainer } from "@/lib/analytics/policy";
export const runtime = "nodejs";
export const maxDuration = 30;
function reply(body: object, status: number) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    return reply(
      { error: "Please send your inquiry using the form on this website." },
      403,
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return reply({ error: "Unsupported request." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 16000)
    return reply({ error: "Your message is too long." }, 413);
  let body: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > 16000)
      return reply({ error: "Your message is too long." }, 413);
    body = JSON.parse(text);
  } catch {
    return reply({ error: "Please check your details and try again." }, 400);
  }
  const inquiry = validateInquiry(body);
  if (!inquiry)
    return reply(
      {
        error:
          "Please enter your name, a valid email, an area of interest, and a message of 20–5,000 characters.",
      },
      400,
    );
  if (!emailDeliveryReady())
    return reply(
      {
        error:
          "The form is temporarily unavailable. Please email hello@chickzen.com.",
      },
      503,
    );
  if (inquiry.newsletter && !newsletterReady())
    return reply(
      {
        error:
          "Newsletter signup is unavailable. Please uncheck updates and send your inquiry again.",
      },
      400,
    );
  try {
    await deliverInquiry(inquiry);
  } catch {
    return reply(
      {
        error:
          "We couldn’t confirm your inquiry was sent. Please try again or email hello@chickzen.com.",
      },
      502,
    );
  }
  let newsletterWarning = false;
  if (inquiry.newsletter) {
    try {
      await subscribeToUpdates(inquiry);
    } catch {
      newsletterWarning = true;
    }
  }
  const analyticsEligible = isPublicProduction() && allowedOrigin(origin) &&
    validContainer(process.env.NEXT_PUBLIC_GTM_ID || "");
  return reply({ accepted: true, analyticsEligible, newsletterWarning }, 202);
}
