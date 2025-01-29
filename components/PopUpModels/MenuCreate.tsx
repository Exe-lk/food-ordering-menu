"use client"
import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'

interface MenuProps{
    isOpen:boolean;
    onClose: () => void
}

const MenuCreate = ({isOpen, onClose}:MenuProps) => {
    const [menuName, setMenuName] = useState("");
    if(!isOpen) return null;
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-85'>
        <div className='bg-white p-6 rounded-lg shadow-lg w-[400px] relative'>
            <button onClick={onClose} className='absolute top-3 right-3 text-gray-700 text-2xl'>
                <FiX/>
            </button>
            <h2 className='text-xl font-semibold text-center mb-4 text-customblue'>Create Menu</h2>
            <div className='mb-3'>
                <label className='block text-gray-700 font-medium'>Menu Name</label>
                <input 
                    type="text" 
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    className='w-full border rounded-md p-2'
                    placeholder='Ex: Italian'
                />
            </div>
            <button className='w-full bg-customblue text-white py-2 rounded-md hover:bg-blue-900 cursor-pointer'>
                Create
            </button>
        </div>
    </div>
  )
}

export default MenuCreate