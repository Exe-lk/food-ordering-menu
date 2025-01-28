"use client"
import React from 'react';

interface Portion {
  size: string;
  price: string;
}

interface CardProps {
  name: string;
  description: string;
  portions: Portion[];
  onEdit: () => void;
  onRemove: () => void;
}

const InternalCard = ({ name, description, portions, onEdit, onRemove }: CardProps) => {
  return (
    <div className="grid grid-cols-4 items-center border rounded-lg shadow-md p-4 mb-4 bg-white hover:bg-gray-300 transition-all duration-300 cursor-pointer">
      {/* Name Column */}
      <div className="text-gray-900 font-bold px-2">{name}</div>

      {/* Portion & Price Column */}
      <div className="flex flex-col px-2">
        {portions.map((portion, index) => (
          <div key={index} className="text-sm text-gray-800">
            {portion.size}: <span className="font-semibold">{portion.price}</span>
          </div>
        ))}
      </div>

      {/* Description Column */}
      <div className="text-gray-700 text-sm px-2">{description}</div>

      {/* Actions Column */}
      <div className="flex space-x-2 justify-center px-2">
        <button
          onClick={onEdit}
          className="px-4 py-2 w-24 text-white bg-customblue hover:bg-blue-900 rounded-md cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={onRemove}
          className="px-4 py-2 w-24 text-white bg-red-800 rounded-md"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default InternalCard;
