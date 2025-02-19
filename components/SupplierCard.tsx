"use client"
import React from 'react'
import { MdDeleteOutline, MdOutlineModeEdit } from 'react-icons/md';

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
                    className="flex items-center justify-center text-white w-16 bg-customGold hover:bg-orange-900 rounded-md shadow-lg text-center text-xl"
                >
                <MdOutlineModeEdit />
                </button>
                <button
                 onClick={() => onRemove(index)}
                className="flex items-center justify-center px-4 py-2 w-16 text-white bg-red-800 rounded-md cursor-pointer shadow-lg text-center text-xl"
                >
                <MdDeleteOutline />
                </button>
            </div>

            </div>
        ))}
    </div>
  )
}

export default SupplierCard