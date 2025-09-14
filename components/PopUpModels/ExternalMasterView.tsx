"use client";
import React from "react";
import { FiX } from "react-icons/fi";
import { ExternalFood } from "@/redux/features/externalProductSlice";

interface MasterViewPopupProps {
    isOpen: boolean;
    onClose: () => void;
    product: ExternalFood | null;
}

const ExternalMasterView = ({isOpen, onClose, product}:MasterViewPopupProps) => {
    if (!isOpen || !product) return null;
    const createdDateStr = product.created_at
    ? product.created_at.split("T")[0].replace(/-/g, ".")
    : "N/A";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        <div className="relative w-full h-[600px] overflow-y-auto max-w-md mx-4 p-6 bg-white rounded shadow-lg">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer"
            >
                <FiX size={24}/>
            </button>
            <h2 className="text-center text-xl font-bold mb-6">
                External Food Record
            </h2>
            <div className="grid grid-cols-[140px_1fr] gap-y-2 text-sm text-black mb-4">
                <div className="font-semibold">Name</div>
                <div>{product.name}</div>

                <div className="font-semibold">Brand</div>
                <div>{product.brand}</div>

                <div className="font-semibold">Category</div>
                <div>{product.category}</div>

                <div className="font-semibold">Description</div>
                <div>{product.description}</div>

                <div className="font-semibold">Unit</div>
                <div>{product.unit}</div>

                <div className="font-semibold">Cost Price</div>
                <div>Rs. {product.costPrice}</div>

                <div className="font-semibold">Quantity</div>
                <div>{product.quantity}</div>

                <div className="font-semibold">Manufacture Date</div>
                <div>{product.manufactureDate}</div>

                <div className="font-semibold">Expiry Date</div>
                <div>{product.expiryDate}</div>

                <div className="font-semibold">Date In</div>
                <div>{product.dateIn}</div>

                <div className="font-semibold">Suppliers</div>
                <div>
                    {product.supplier && product.supplier.length > 0
                    ? product.supplier.map((sup, index) => (
                        <div key={index} className="border-b last:border-0">
                            {sup.name}
                        </div>
                        ))
                    : "N/A"}
                </div>

                <div className="font-semibold">Created Date</div>
                <div>{createdDateStr}</div>

                <div className="font-semibold">Created By</div>
                <div>{product.created_by || "N/A"}</div>
            </div>
            <div className="flex justify-center">
                <img src={product.image_url} alt={product.name} />
            </div>
        </div>
    </div>
  )
}

export default ExternalMasterView