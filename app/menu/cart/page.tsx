// src/app/CartPage.tsx
"use client";

import { removeFromCart, updateQuantity, clearCart } from "@/redux/features/cartSlice";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/redux/features/orderSlice";
import Swal from "sweetalert2";
import NavBar from "@/components/MenuSide/NavBar";

const CartPage = () => {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  
  // New state to track whether the order is being placed.
  const [isPlacing, setIsPlacing] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const subTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const taxes = Math.round(subTotal * 0.125);
  const grandTotal = subTotal + taxes;

  const handleRemove = (name: string, portion: string) => {
    dispatch(removeFromCart({ name, portion }));
  };

  const handleQuantityChange = (
    name: string,
    portion: string,
    newQuantity: number
  ) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ name, portion, quantity: newQuantity }));
    }
  };

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    try {
      const order = await dispatch(placeOrder()).unwrap();
      Swal.fire({
        title: "Order Placed Successfully",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() =>{
        router.push("/menu/orders")
      })
      dispatch(clearCart());
    } catch (error) {
      Swal.fire({
        title: "Failed to Place Order",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div>
      <NavBar/>
      <div className="bg-white min-h-screen text-black p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="text-white">
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-center flex-grow -ml-8">
            Order Summary
          </h1>
        </div>

        <div
          className="flex-grow w-full mx-auto overflow-y-auto"
          style={{ maxHeight: "70vh" }}
        >
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="bg-white border-2 border-black shadow-2xl p-4 rounded-lg mb-4 flex justify-between items-center shadow-md"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-grow px-4">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm">{item.portion}</p>
                <div className="flex items-center mt-2">
                  <button
                    className="bg-customGold px-3 py-1 rounded text-white"
                    onClick={() =>
                      handleQuantityChange(item.name, item.portion, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    className="bg-customGold px-3 py-1 rounded text-white"
                    onClick={() =>
                      handleQuantityChange(item.name, item.portion, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <button
                  onClick={() => handleRemove(item.name, item.portion)}
                  className="bg-transparent text-red-500 p-2 rounded-md"
                >
                  <FaTrashAlt size={20} />
                </button>
                <p className="text-lg font-bold mt-2">
                  {item.price * item.quantity} LKR
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 border-2 border-black rounded-lg text-sm shadow-lg mt-4 w-full mx-auto">
          <div className="flex justify-between">
            <span>Total</span>
            <span>{subTotal} LKR</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>{taxes} LKR</span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-2">
            <span>Sub Total</span>
            <span>{grandTotal} LKR</span>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-black rounded-t-[40px] p-4 flex items-center justify-center">
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacing}
          className="bg-[#C47A4D] text-white w-[90%] py-3 text-center text-lg font-bold rounded-full disabled:opacity-50 max-w-sm"
        >
          {isPlacing ? "Placing..." : "Place Order"}
        </button>
      </div>
      </div>
    </div>
  );
};

export default CartPage;
