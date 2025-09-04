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
    
    console.log("Creating payment intent:", { orderId, amount });
    
    // Validate input
    if (!orderId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid order ID or amount" }, 
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure amount is integer
      currency: 'lkr',
      payment_method_types: ['card'],
      metadata: { orderId },
    });
    
    console.log("Payment intent created successfully:", paymentIntent.id);
    
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" }, 
      { status: 500 }
    );
  }
}
