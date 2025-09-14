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
import Swal from "sweetalert2";

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
    console.log("Payment form submitted");
    
    if (!stripe || !elements) {
      console.error("Stripe or elements not loaded");
      setErrorMessage("Payment system not ready. Please try again.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      console.log("Confirming payment...");
      
      // First, validate the payment element
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error("Form validation error:", submitError);
        setErrorMessage(submitError.message || "Please check your payment details");
        setLoading(false);
        return;
      }

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              address: {
                country: "LK",
              },
            },
          },
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment confirmation error:", error);
        setErrorMessage(error.message || "Payment Failed");
        setLoading(false);
      } else {
        console.log("Payment successful:", paymentIntent);
        try {
          console.log("Updating order status...");
          await dispatch(updateOrderStatus({ id: orderId, status: "Completed" })).unwrap();
         
          await Swal.fire({
            title: "Payment Successful",
            text: "Your order has been completed",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
         
          router.push("/menu/orders");
        } catch (err) {
          console.error("Error updating order status:", err);
          setErrorMessage("Payment successful but failed to update order status");
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Unexpected error during payment:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <PaymentElement
        options={{
          layout: "accordion",
          fields: { billingDetails: { address: { country: "never" } } },
        }}
      />
      {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className={`w-full font-bold py-2 px-2 rounded ${
          !stripe || !elements || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-customblue hover:bg-blue-900"
        } text-white`}
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

export default PaymentForm;
