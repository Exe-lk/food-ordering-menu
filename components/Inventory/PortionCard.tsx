"use client";
import React from "react";

interface Portion {
  name: string;
  serves: string;
}

interface PortionCardProps {
  portions: Portion[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

const PortionCard = ({ portions, onEdit, onRemove }: PortionCardProps) => {
  return (
    <div className="mt-5 space-y-6"> 
      {portions.map((portion, index) => (
        <div 
          key={index} 
          className="flex justify-between border rounded-lg shadow-md p-4 bg-white hover:bg-gray-300 transition-all duration-300 cursor-pointer"
        >
          <div className="text-black font-semibold w-40 text-center">{portion.name}</div>
          <div className="text-gray-700 w-40 text-center">{portion.serves}</div> 
          <div className="flex space-x-2 justify-center w-96"> 
            <button
              onClick={() => onEdit(index)}
              className="px-4 py-2 w-24 text-white bg-customblue hover:bg-blue-900 rounded-md shadow-lg cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => onRemove(index)}
              className="px-4 py-2 w-24 text-white bg-red-800 rounded-md cursor-pointer shadow-lg"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortionCard;
