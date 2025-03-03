"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/PaymentForm";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const page = () => {
  const params = useParams();
  const orderId = params.orderId as string;
  const order = useSelector((state: RootState) =>
    state.order.orders.find((o) => o.id === orderId)
  );
  
  if (!order) {
    return <p>Order not found</p>;
  }
  const subTotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discount = 0;
  const total = subTotal - discount;
  const amount = total * 100


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Payment</h2>
            <p className="mb-4 text-center">Total Amount: {total} LKR</p>
            <Elements stripe={stripePromise}>
                <PaymentForm orderId={orderId} amount={amount}/>
            </Elements>
        </div>
    </div>
  )
}

export default page