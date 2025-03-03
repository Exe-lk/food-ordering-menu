// app/payment-success/page.tsx
"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessPage() {
  // Wrap the client logic in a Suspense boundary:
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}

function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Payment Successful</h1>
      <p className="mb-4">
        Your payment for order was successful!
      </p>
      <Link
        href="/menu/orders"
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Go to Order List
      </Link>
    </div>
  );
}
