// components/PaymentForm.tsx
"use client";
import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "@/redux/features/orderSlice";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store";

interface PaymentFormProps {
  orderId: string;
  amount: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ orderId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setErrorMessage("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?orderId=${orderId}`,
        payment_method_data:{
          billing_details:{
            address:{
              country:"LK"
            }
          }
        }
        
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Payment Failed");
      setLoading(false);
    } else {
      try {
        await dispatch(updateOrderStatus({ id: orderId, status: "Completed" })).unwrap();
        router.push(`/payment-success?orderId=${orderId}`);
      } catch (err) {
        setErrorMessage("Failed to update Order Status");
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <PaymentElement options={{ layout: "accordion", fields:{billingDetails:{address:{country:"never"}}} }} />
      {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-customblue hover:bg-blue-900 text-white font-bold py-2 px-2 rounded"
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

export default PaymentForm;
