"use client";
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateCategory, fetchCategories, IngredientCategory } from "@/redux/features/ingredientCategorySlice";
interface CategoryEditProps{
    isOpen:boolean;
    onClose:() => void;
    category:IngredientCategory
}
const CategoryEdit = ({isOpen, onClose, category}:CategoryEditProps) => {
    const dispatch = useDispatch<any>();
    const { loading } = useSelector((state: RootState) => state.categories);
    const [categoryName, setCategoryName] = useState(category.name)

    useEffect(() => {
        if(category){
            setCategoryName(category.name);
        }
    },[category]);

    const handleUpdate = async() =>{
        if(categoryName === category.name) return;

        try {
            await dispatch(
                updateCategory({id:category.id, updatedName:categoryName})
            ).unwrap();
            dispatch(fetchCategories());
            onClose();
        } catch (error) {
            console.error("Error Updating Category", error)
        }
    };

    if(!isOpen) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-85'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-[400px] relative'>
                <button onClick={(onClose)} className='absolute top-3 right-3 text-gray-700 text-2xl'>
                    <FiX/>
                </button>
                <h2 className='text-xl font-semibold text-center mb-4 text-customblue'>Create Category</h2>
                <div className='mb-3'>
                    <label htmlFor="categoryname" className='block text-gray-700 font-medium'>Name</label>
                    <input 
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className='w-full border rounded-md p-2 text-black'
                        placeholder='Enter Category Name'
                    />
                </div>
                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className='w-full bg-customblue text-white py-2 rounded-md hover:bg-blue-900 cursor-pointer'
                >
                    {loading ? "Updating...":"Update"}
                </button>
            </div>
        </div>
  )
}

export default CategoryEdit