"use client";
import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "@/redux/features/orderSlice";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store";

interface PaymentFormProps {
    orderId: string;
    amount: number; 
  }

const PaymentForm = ({orderId, amount}:PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() =>{
    const createPaymentIntent = async() =>{
        const res = await fetch("/api/create-payment-intent",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({orderId, amount}),
        });
        const data = await res.json();
        setClientSecret(data.clientSecret);
    };
    createPaymentIntent();
  },[orderId,amount]);

  const handleSubmit = async (e:React.FormEvent) =>{
    e.preventDefault();
    if(!stripe || !elements || !clientSecret) return
    setLoading(true);
    const cardElement = elements.getElement(CardElement);
    if(!cardElement){
        setErrorMessage("Card details not found");
        setLoading(false);
        return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
    if(error){
        setErrorMessage(error.message || "Payment Failed");
        setLoading(false);
    }else if (paymentIntent && paymentIntent.status === "succeeded"){
        try {
            await dispatch(updateOrderStatus({ id: orderId, status: "Completed" })).unwrap();
            router.push("/payment-success");
        } catch (error) {
            setErrorMessage("Failed to update Order Status")
        }
        setLoading(false);
    };
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
        <CardElement options={{hidePostalCode:true}} className="mb-4 px-4 py-2 border border-customorange"/>
        {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
        <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-customblue hover:bg-blue-900 text-white font-bold py-2 px-2 rounded"
        >
            {loading ? "Processing...":"Pay"}
        </button>
    </form>
  )
}

export default PaymentForm