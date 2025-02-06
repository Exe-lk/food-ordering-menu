"use client";
import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import ingredientCategories from "@/data/ingredientCategories";
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const IngredientCreate = ({ isOpen, onClose }: ProductModalProps) => {
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    category: "",
    brand: "",
    costPrice: "",
    quantity: "",
    unit: "",
    dateIn: "",
    supplier: "",
    description: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-[500px] max-h-[90vh] overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-center w-full text-customblue">Create Ingredients</h2>
            <button onClick={onClose} className="text-gray-500 text-2xl font-bold hover:text-gray-700">
            <FiX/>
            </button>
        </div>
        {/* Form */}
        <form>
          <div className="mb-4">
            <label className="block text-customblue font-medium mb-1">
              Ingredient Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Enter ingredient name"
              value={newIngredient.name}
              onChange={(e) =>
                setNewIngredient({ ...newIngredient, name: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-customblue font-medium mb-1">
              Category
            </label>
            <select
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              value={newIngredient.category}
              onChange={(e) =>
                setNewIngredient({ ...newIngredient, category: e.target.value })
              }
            >
              <option value="">Select category</option>
              {ingredientCategories.map((category) => (
                <option key={category} value={category} className="text-black">
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-customblue font-medium mb-1">
                Brand
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                placeholder="Enter brand"
                value={newIngredient.brand}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, brand: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-customblue font-medium mb-1">
                Cost Price
              </label>
              <input
                type="number"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                placeholder="LKR 0.00"
                value={newIngredient.costPrice}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, costPrice: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-customblue font-medium mb-1 ">
                Quantity
              </label>
              <input
                type="number"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                placeholder="Enter quantity"
                value={newIngredient.quantity}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, quantity: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-customblue font-medium mb-1">Unit</label>
              <select
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                value={newIngredient.unit}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, unit: e.target.value })
                }
              >
                <option value="">Select unit</option>
                <option value="Kg">Kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="ml">ml</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-customblue font-medium mb-1">
                Date In
              </label>
              <input
                type="date"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                value={newIngredient.dateIn}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, dateIn: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-customblue font-medium mb-1">
                Supplier
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                placeholder="Enter supplier name"
                value={newIngredient.supplier}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, supplier: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-customblue font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Add a description"
              rows={3}
              value={newIngredient.description}
              onChange={(e) =>
                setNewIngredient({
                  ...newIngredient,
                  description: e.target.value,
                })
              }
            ></textarea>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="bg-customblue text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IngredientCreate;
