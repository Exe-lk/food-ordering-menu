"use client"
import React from 'react';
import ActionButton from '../ActionButton';

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
      <div className="text-gray-900 font-bold px-2 items-center justify-center text-center">{name}</div>

      {/* Portion & Price Column */}
      <div className="flex flex-col px-2">
        {portions.map((portion, index) => (
          <div key={index} className="text-sm text-gray-800 text-center items-center justify-center border-l border-r border-gray-600">
            {portion.size}: <span className="font-semibold">{portion.price}</span>
          </div>
        ))}
      </div>

      {/* Description Column */}
      <div className="text-gray-700 text-sm px-2 border-r border-gray-600">{description}</div>

      {/* Actions Column */}
      <ActionButton onEdit={onEdit} onRemove={onRemove} />
    </div>
  );
};

export default InternalCard;
