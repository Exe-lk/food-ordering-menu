
"use client";
import { addToCart } from "@/redux/features/cartSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

interface PortionPopUpProps {
  name: string;
  portions: { size: string; price: string }[];
  onClose: () => void;
  image: string;
}

const PortionPopUp = ({ name, portions, image, onClose }: PortionPopUpProps) => {
  const [selectedPortions, setSelectedPortions] = useState<
    { size: string; quantity: number }[]
  >([]);
  const dispatch = useDispatch();
  const handleQuantityChange = (size: string, change: number) => {
    setSelectedPortions((prev) => {
      const existingPortion = prev.find((p) => p.size === size);
      if (existingPortion) {
        const newQuantity = Math.max(1, existingPortion.quantity + change);
        return prev.map((p) => (p.size === size ? { ...p, quantity: newQuantity } : p));
      }
      return [...prev, { size, quantity: 1 }];
    });
  };
  const handleAddToCart = () => {
    if (selectedPortions.length > 0) {
      selectedPortions.forEach(({ size, quantity }) => {
        const price = portions.find((p) => p.size === size)?.price || "0";
        dispatch(
          addToCart({
            name,
            portion: size,
            quantity,
            price: +price,
            image,
          })
        );
      });
      onClose();
    } else {
      alert("Please select at least one portion.");
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-customGold">{name}</h2>
        <div className="mb-4">
          <label className="block font-bold mb-2 text-customGold">Select Portions:</label>
          {portions.map((portion, index) => (
            <div key={index} className="mb-4">
              <input
                type="checkbox"
                id={portion.size}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedPortions((prev) => [
                      ...prev,
                      { size: portion.size, quantity: 1 },
                    ]);
                  } else {
                    setSelectedPortions((prev) =>
                      prev.filter((p) => p.size !== portion.size)
                    );
                  }
                }}
              />
              <label htmlFor={portion.size} className="ml-2 text-customGold">
                {portion.size} - {portion.price} LKR
              </label>
              {selectedPortions.some((p) => p.size === portion.size) && (
                <div className="mt-2 flex items-center">
                  <button
                    onClick={() => handleQuantityChange(portion.size, -1)}
                    className="w-8 h-8 bg-gray-700 text-customGold rounded-md flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="mx-4 text-lg text-customGold">
                    {
                      selectedPortions.find((p) => p.size === portion.size)
                        ?.quantity || 1
                    }
                  </span>
                  <button
                    onClick={() => handleQuantityChange(portion.size, 1)}
                    className="w-8 h-8 bg-gray-700 text-customGold rounded-md flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-customBeige text-customGold border border-customGold p-2 rounded-md w-16"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-customGold text-white px-4 py-2 rounded-md w-16"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
export default PortionPopUp;
