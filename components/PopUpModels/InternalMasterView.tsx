"use client";
import React from "react";
import { FiX } from "react-icons/fi";
import { InternalFood } from "@/redux/features/internalProductSlice";

interface MasterViewPopupProps {
    isOpen: boolean;
    onClose: () => void;
    product: InternalFood | null;
}

const InternalMasterView = ({isOpen, onClose, product}:MasterViewPopupProps) => {
    if (!isOpen || !product) return null;
    const createdDateStr = product.created_at
    ? product.created_at.split("T")[0].replace(/-/g, ".")
    : "N/A";
    const portionName =
    product.sizes && product.sizes.length > 0 ? product.sizes[0].size : "N/A";
   const price =
    product.sizes && product.sizes.length > 0 ? product.sizes[0].price : "N/A";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        <div className="relative w-full max-w-md mx-4 p-6 bg-white rounded shadow-lg">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer"
            >
                <FiX size={24}/>
            </button>
            <h2 className="text-center text-xl font-bold mb-6">
                Internal Food Records
            </h2>
            <div className="grid grid-cols-[140px_1fr] gap-y-2 text-sm text-black mb-4">
                <div className="font-semibold">Name</div>
                <div>{product.name}</div>

                <div className="font-semibold">Category</div>
                <div>{product.category}</div>

                <div className="font-semibold">Description</div>
                <div>{product.description}</div>

                <div className="font-semibold">Portion Name</div>
                <div>{portionName}</div>

                <div className="font-semibold">Price</div>
                <div>{price} LKR</div>

                <div className="font-semibold">Created Date</div>
                <div>{createdDateStr}</div>

                <div className="font-semibold">Created By</div>
                <div>{product.created_by ?? "N/A"}</div>
            </div>
            <div className="flex justify-center">
                <img src={product.imageUrl} alt={product.name} className="w-80 h-72 object-cover" />
            </div>
        </div>
    </div>
  )
}

export default InternalMasterView