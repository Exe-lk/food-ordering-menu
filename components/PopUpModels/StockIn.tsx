"use client";
import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { stockIn } from "@/redux/features/ingredientsSlice";
import { AppDispatch } from "@/redux/store";
interface StockInProps {
  isOpen: boolean;
  onClose: () => void;
  ingredientId:string;
  ingredientName: string;
  category: string;
}

const StockIn = ({ isOpen, onClose, ingredientId, ingredientName, category }: StockInProps) => {
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [supplier, setSupplier] = useState("");
  const [dateIn, setDateIn] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  if (!isOpen) return null;

  const handleSubmit = (e:React.FormEvent) =>{
    e.preventDefault();

    dispatch(
      stockIn({
        id:ingredientId,
        quantity,
        costPrice,
        unit,
        brand,
        supplier,
        dateIn
      })
    );

    setQuantity("");
    setCostPrice("");
    setUnit("");
    setSupplier("");
    setDateIn("");
    onClose();
  }


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto hide-scrollbar max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX/>
        </button>
        {/* Heading */}
        <h2 className="text-2xl font-bold mb-4 text-customblue">Stock In</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4 text-customblue">
            {/* Ingredient Name */}
            <div className="col-span-2">
              <label className="block font-semibold mb-1">Ingredient Name</label>
              <input
                type="text"
                value={ingredientName}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Category */}
            <div className="col-span-2">
              <label className="block font-semibold mb-1">Category</label>
              <input
                type="text"
                value={category}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block font-semibold mb-1">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Enter brand"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Cost Price */}
            <div>
              <label className="block font-semibold mb-1">Cost Price</label>
              <input
                type="text"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-semibold mb-1">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block font-semibold mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
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

            {/* Date In */}
            <div>
              <label className="block font-semibold mb-1">Date In</label>
              <input
                type="date"
                value={dateIn}
                onChange={(e) => setDateIn(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block font-semibold mb-1">Supplier</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Stock In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockIn;
