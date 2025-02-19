"use client";
import React from "react";
import { GoArrowUpRight, GoArrowDownRight } from "react-icons/go";
import ActionButton from "../ActionButton";

interface IngredientCardProps {
  category: string;
  productName: string;
  quantity: string;
  dateIn: string;
  costPrice: string;
  supplier: string;
  onEdit: () => void;
  onRemove: () => void;
  onStockIn: () => void;
  onStockOut: () => void;
}

const IngredientCard = ({
  category,
  productName,
  quantity,
  dateIn,
  costPrice,
  supplier,
  onEdit,
  onRemove,
  onStockIn,
  onStockOut,
}: IngredientCardProps) => {
  return (
    <div className="grid grid-cols-7 items-center border rounded-lg shadow-md p-4 mb-4 bg-white hover:bg-gray-300 transition-all duration-300 cursor-pointer">
      <div className="text-gray-900 font-bold text-justify">{category}</div>
      <div className="text-gray-900 font-bold text-justify">{productName}</div>
      <div className="text-gray-900 font-bold text-center">{quantity}</div>
      <div className="col-span-2 flex items-center justify-center space-x-2">
        <button
          onClick={onStockIn}
          className="px-4 py-2 text-white bg-customgreen hover:bg-green-600 rounded-md w-16 text-xl"
        >
          <GoArrowUpRight />
        </button>
        <button
          onClick={onStockOut}
          className="px-4 py-2 text-white bg-customorange hover:bg-orange-400 rounded-md w-16 text-xl"
        >
          <GoArrowDownRight />
        </button>
      </div>
      <div className="col-span-2">
        <ActionButton onEdit={onEdit} onRemove={onRemove} />
      </div>
    </div>
  );
};

export default IngredientCard;
