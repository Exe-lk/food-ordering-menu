"use client"
import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { fetchCategories, addCategory, clearError  } from '@/redux/features/ingredientCategorySlice';
import Swal from "sweetalert2";

interface CategoryProps{
    isOpen:boolean;
    onClose:() => void;
}

const CategoryCreate = ({isOpen, onClose}:CategoryProps) => {
    const [categoryName, setCategoryName] = useState("");
    const dispatch = useDispatch<any>();
    const {loading, error} = useSelector((state:RootState)=> state.categories)
    if(!isOpen) return null;
    const handleCreate = async () =>{
        if(!categoryName) return;
        try {
            await dispatch(addCategory({name:categoryName})).unwrap();
            setCategoryName("");
            dispatch(fetchCategories());
            onClose();
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: (error as string) || "Failed to create category.",
                icon: "error",
            });
            dispatch(clearError())
        }
    }
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-85'>
        <div className='bg-white p-6 rounded-lg shadow-lg w-[400px] relative'>
            <button onClick={(onClose)} className='absolute top-3 right-3 text-gray-700 text-2xl'>
                <FiX/>
            </button>
            <h2 className='text-xl font-semibold text-center mb-4 text-customGold'>Create Category</h2>
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
                onClick={handleCreate}
                disabled={loading}
                className='w-full bg-customGold text-white py-2 rounded-md hover:bg-orange-500 cursor-pointer'
            >
                {loading ? "Creating...":"Create"}
            </button>
        </div>
    </div>
  )
}

export default CategoryCreate