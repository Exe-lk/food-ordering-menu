"use client";
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchIngredients, Ingredient, updateIngredient } from "@/redux/features/ingredientsSlice";

interface IngredientEditProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient;
}

const IngredientEdit = ({ isOpen, onClose, ingredient }: IngredientEditProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.ingredients);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    unit: "",
  });
  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        category: ingredient.category,
        description: ingredient.description,
        unit: ingredient.unit,
      });
    }
  }, [ingredient]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resultAction = await dispatch(
      updateIngredient({ id: ingredient.id, updatedIngredient: formData })
    );
    if (resultAction.meta.requestStatus === "fulfilled") {
      dispatch(fetchIngredients());
      onClose();
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-[500px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-center w-full text-customblue">
            Edit Ingredient
          </h2>
          <button onClick={onClose} className="text-gray-500 text-2xl font-bold hover:text-gray-700">
            <FiX />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-customblue font-medium mb-1">
              Ingredient Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Enter ingredient name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-customblue font-medium mb-1">
              Category
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Enter category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-customblue font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Add a description"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-customblue font-medium mb-1">
              Unit
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Enter unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-customGold text-white px-6 py-2 rounded-lg hover:bg-orange-500 focus:ring-2 focus:ring-blue-400"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default IngredientEdit