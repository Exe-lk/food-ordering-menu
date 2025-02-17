"use client";
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchCategories } from "@/redux/features/ingredientCategorySlice";
import { addIngredients } from "@/redux/features/ingredientsSlice";

import ingredientCategories from "@/data/ingredientCategories";
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const IngredientCreate = ({ isOpen, onClose }: ProductModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {loading, error} = useSelector((state:RootState) => state.ingredients)
  const {categories, loading:categoryLoading} = useSelector(
    (state:RootState) => state.categories
  )

  const [newIngredient, setNewIngredient] = useState({
    name: "",
    category: "",
    unit: "",
    description: "",
  });

  useEffect(() =>{
    dispatch(fetchCategories())
  },[dispatch]);

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    const resultAction = await dispatch(addIngredients({newIngredients:newIngredient}));
    if(resultAction.meta.requestStatus === "fulfilled"){
      setNewIngredient({
        name:"",
        category:"",
        description:"",
        unit:""
      });
      onClose();
    }
  }

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
        <form onSubmit={handleSubmit}>
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
              {categoryLoading ? (
                <option value="">Loading Categories</option>
              ):(
                categories.map((option) =>(
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))
              )}
            </select>
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
              type="submit"
              className="bg-customblue text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            >
              {loading ? "Creating...":"Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IngredientCreate;
