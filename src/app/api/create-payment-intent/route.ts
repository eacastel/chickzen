import Stripe from "stripe";
import { getAllServiceTypes } from "@/lib/contentful";
import { quoteServices } from "@/lib/checkout";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return Response.json(
      { error: "Please use the checkout on this website." },
      { status: 403 },
    );
  if (process.env.CHECKOUT_ENABLED !== "true" || !process.env.STRIPE_SECRET_KEY)
    return Response.json(
      {
        error:
          "Online checkout is temporarily unavailable. Please contact Jen.",
      },
      { status: 503 },
    );
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid checkout request." },
      { status: 400 },
    );
  }
  let quote;
  try {
    quote = quoteServices(
      body?.productIds,
      body?.currency,
      await getAllServiceTypes(),
    );
  } catch {
    return Response.json(
      { error: "Please check your selected services and currency." },
      { status: 400 },
    );
  }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-04-30.basil",
    });
    const intent = await stripe.paymentIntents.create({
      amount: quote.amount,
      currency: quote.currency.toLowerCase(),
      metadata: { productIds: quote.productIds.join(",") },
    });
    return Response.json(
      {
        clientSecret: intent.client_secret,
        amount: quote.amount,
        currency: quote.currency,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      {
        error: "Payment could not be started. Please try again or contact Jen.",
      },
      { status: 502 },
    );
  }
}
