// src/app/api/create-payment-intent/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: Request) {
  const { name, email, amount, currency } = await req.json(); // ⬅︎ from frontend

  if (!amount || !currency) {
    return NextResponse.json({ error: "Missing amount or currency" }, { status: 400 });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount),            // already in cents from client
    currency: (currency as string).toLowerCase(), // "usd" or "eur"
    metadata: { name, email },
    receipt_email: email,
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
