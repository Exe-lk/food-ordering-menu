"use client";
import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";
import portionOptions from "@/data/portionst+";
import menuData from "@/data/menus";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Create = ({ onClose, isOpen }: ProductModalProps) => {
  const [productSizes, setProductSizes] = useState([{ size: "", price: "" }]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    image: null,
  });

  if (!isOpen) return null;

  const handleAddSize = () => {
    setProductSizes([...productSizes, { size: "", price: "" }]);
  };

  const handleRemoveSize = (index: number) => {
    const updatedSizes = productSizes.filter((_, i) => i !== index);
    setProductSizes(updatedSizes);
  };

  const handleSizeChange = (index: number, key: string, value: string) => {
    const updatedSizes = productSizes.map((size, i) =>
      i === index ? { ...size, [key]: value } : size
    );
    setProductSizes(updatedSizes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-black">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[600px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-center w-full">
            Create Product
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 text-2xl font-bold hover:text-gray-700"
          >
            <FiX />
          </button>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-gray-700 font-medium">Product Name</label>
          <input
            type="text"
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
        </div>

        {/* Category */}
        <div className="mt-3">
          <label className="block text-gray-700 font-medium">Category</label>
          <select
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {menuData.map((menu) => (
              <option key={menu.id} value={menu.name}>
                {menu.name}
              </option>
            ))}
          </select>
        </div>
        {/* Portion & Price Section */}
        {productSizes.map((size, index) => (
        <div key={index} className="flex items-center gap-2 mt-3">
            {/* Portion Dropdown */}
            <select
                className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={size.size}
                onChange={(e) => handleSizeChange(index, "size", e.target.value)}
              >
                <option value="">Select Portion</option>
                {portionOptions.map((option, i) => (
                  <option key={i} value={option.name}>
                    {option.name} - {option.serves} 
                  </option>
                ))}
              </select>
            {/* Price Input */}
            <input
            type="text"
            placeholder="Rs. 0.00"
            className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={size.price}
            onChange={(e) =>
                handleSizeChange(index, "price", e.target.value)
            }
            />

            {/* Remove Button (Properly Aligned) */}
            <div className="shrink-0">
            <button
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                onClick={() => handleRemoveSize(index)}
            >
                Remove
            </button>
            </div>
        </div>
        ))}


        {/* Add Size Button */}
        <button
          className="w-full mt-3 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          onClick={handleAddSize}
        >
          + Add
        </button>

        {/* Description */}
        <div className="mt-3">
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="mt-3">
          <label className="block text-gray-700 font-medium">Image</label>
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg flex flex-col items-center justify-center">
            <FiUpload className="text-gray-500 text-3xl" />
            <input
              type="file"
              className="hidden"
              id="image-upload"
              onChange={() => {}}
            />
            <label
              htmlFor="image-upload"
              className="mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300"
            >
              Choose File
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex justify-center">
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg w-full hover:bg-blue-700"
            onClick={() => {
              console.log(newProduct, productSizes);
              onClose();
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;
