"use client";
import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { stockOut } from "@/redux/features/ingredientsSlice";
import { AppDispatch } from "@/redux/store";

interface StockOutProps {
  isOpen: boolean;
  onClose: () => void;
  ingredientId: string;
  ingredientName: string;
  category: string;
}

const StockOut = ({
  isOpen,
  onClose,
  ingredientId,
  ingredientName,
  category,
}: StockOutProps) => {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [dateOut, setDateOut] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      stockOut({
        id: ingredientId,
        quantity,
        reason,
        dateOut,
        unit: selectedUnit,
      })
    );

    // Clear form fields and close modal
    setQuantity("");
    setReason("");
    setDateOut("");
    setSelectedUnit("");
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-85 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto hide-scrollbar max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-customGold">Stock Out</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4 text-customGold">
            <div className="col-span-2">
              <label className="block font-semibold mb-1">
                Ingredient Name
              </label>
              <input
                type="text"
                value={ingredientName}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-semibold mb-1">Category</label>
              <input
                type="text"
                value={category}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Quantity</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Date Out</label>
              <input
                type="date"
                value={dateOut}
                onChange={(e) => setDateOut(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Unit</label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="" disabled>
                  Select Unit
                </option>
                <option value="Kg">Kg</option>
                <option value="L">L</option>
                <option value="Packs">Packs</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-customblue">
              Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black"
              rows={4}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-customorange hover:bg-orange-400"
            >
              Stock Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockOut;
