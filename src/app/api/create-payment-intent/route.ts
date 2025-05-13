import { NextResponse } from "next/server";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  const { name, email } = await req.json();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 32707, // €327.07 in cents
    currency: "eur",
    metadata: { name, email },
    receipt_email: email,
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
