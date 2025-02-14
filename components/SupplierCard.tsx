"use client"
import React from 'react'

interface Supplier{
    name:string;
    address:string;
    contact:string;
}

interface SupplierCardProps{
    suppliers:Supplier[];
    onEdit:(index:number) => void;
    onRemove:(index:number)=> void;
}

const SupplierCard = ({suppliers, onEdit,onRemove}:SupplierCardProps) => {
  return (
    <div className='mt-5 space-y-6'>
        {suppliers.map((supplier, index) =>(
            <div key={index}
                className='grid grid-cols-5 items-center border rounded-lg shadow-md p-4 bg-white hover:bg-gray-100 transition-all duration-300 cursor-pointer'
            >
                <div className='text-black font-semibold text-center'>{supplier.name}</div>
                <div className='text-black font-semibold text-center'>{supplier.address}</div>
                <div className='text-black font-semibold text-center'>{supplier.contact}</div>
                <div className="flex space-x-2 justify-center">
                <button
                onClick={() => onEdit(index)}
                 className="px-4 py-2 text-white bg-customblue hover:bg-blue-900 rounded-md shadow-lg"
                >
                    Edit
                </button>
                <button
                onClick={() => onRemove(index)}
                className="px-4 py-2 text-white bg-red-800 rounded-md shadow-lg"
                >
                    Remove
                </button>
            </div>

            </div>
        ))}
    </div>
  )
}

export default SupplierCard