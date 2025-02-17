"use client"
import React from 'react'

interface Category{
    name:string;
}
interface CategoryCardProps{
    categories:Category[];
    onEdit:(index:number) => void;
    onRemove:(index:number) => void;
}
const CategoryCard = ({categories, onEdit, onRemove}:CategoryCardProps) => {
  return (
    <div className='mt-5 space-y-6'>
        {categories.map((category,index) =>(
            <div
                key={index}
                className='flex justify-between border rounded-lg shadow-md p-4 bg-white hover:bg-gray-300 transition-all duration-300'
            >
                <div className='text-black font-semibold w-40 text-center'>{category.name}</div>
                <div className='flex space-x-2 justify-center w-96'>
                    <button
                        onClick={()=> onEdit(index)}
                        className='px-4 py-2 w-24 text-white bg-customblue cursor-pointer shadow-lg'
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onRemove(index)}
                        className='px-4 py-2 w-24 text-white bg-red-800 cursor-pointer shadow-lg'
                    >
                        Remove
                    </button>
                </div>
            </div>
        ))}
    </div>
  )
}

export default CategoryCard