// app/api/create-payment-intent/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing Stripe secret key");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const { orderId, amount } = await request.json();
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'lkr',
      payment_method_types: ['card'],
      metadata: { orderId },
    });
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
