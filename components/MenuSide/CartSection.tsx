// src/components/CartSection.tsx
"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";

const CartSection = () => {
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);
  const router = useRouter();

  // Hide if cart is empty
  if (totalItems === 0) return null;

  return (
    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-40
        flex
        items-center
        justify-between
        px-4
        py-3
        bg-overlayBack      
        text-white
        rounded-t-2xl     
        shadow-md
      "
      style={{ height: "70px" }} // Adjust to match the exact height in your design
    >
      <span className="font-semibold">
        {totalItems} Item{totalItems > 1 ? "s" : ""} in Cart
      </span>

      <button
        className="
          flex
          items-center
          justify-center
          bg-customorange
          rounded-full
          p-3
          hover:bg-[#a9643c]   /* Slight hover effect */
          transition
          duration-300
        "
        onClick={() => router.push("/menu/cart")}
      >
        <FaShoppingCart size={20} />
      </button>
    </div>
  );
};

export default CartSection;
