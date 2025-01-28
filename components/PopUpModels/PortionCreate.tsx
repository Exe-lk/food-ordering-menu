"use client"
import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'

interface PortionProps{
    isOpen:boolean;
    onClose: () => void;

}
const PortionCreate = ({isOpen, onClose}:PortionProps) => {
    const [portionName, setPortionName] = useState("");
    const [portionServe, setPortionServe] = useState("");

    if(!isOpen) return null;
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-85'>
        <div className='bg-white p-6 rounded-lg shadow-lg w-[400px] relative'>
            <button onClick={onClose} className='absolute top-3 right-3 text-gray-700 text-2xl'>
                <FiX/>
            </button>
            <h2 className='text-xl font-semibold text-center mb-4 text-customblue'>Create Portion</h2>

            <div className='mb-3'>
                <label className='block text-gray-700 font-medium'>Name</label>
                <input 
                    type="text" 
                    value={portionName}
                    onChange={(e) => setPortionName(e.target.value)}
                    className='w-full border rounded-md p-2'
                    placeholder='Enter Portion Name'
                />
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700 font-medium'>Served Persons</label>
                <div className='flex items-center border rounded-md p-2'>
                    <input 
                        type="text" 
                        value={portionServe}
                        onChange={(e) => setPortionServe(e.target.value)}
                        className='w-full ml-2 outline-none'
                        placeholder='Served Persons'
                    />
                </div>
            </div>
            <button className='w-full bg-customblue text-white py-2 rounded-md hover:bg-blue-900 cursor-pointer'>
                Create
            </button>
        </div>
    </div>
  )
}

export default PortionCreate