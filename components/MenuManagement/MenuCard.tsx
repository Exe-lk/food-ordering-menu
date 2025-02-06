"use client"
import React from 'react'

interface Menu{
  name:string;
}
interface MenuCardProps{
  menus: Menu[];
  onEdit: (index:number) => void;
  onRemove: (index:number) => void;
}
const MenuCard = ({menus, onEdit, onRemove}:MenuCardProps) => {
  return (
    <div className='mt-5 space-y-6'>
      {menus.map((menu, index) =>(
        <div
          key={index}
          className='flex justify-between border rounded-lg shadow-md bg-white p-4 hover:bg-gray-300 transition-all duration-300 cursor-pointer'
        >
          <div className='text-black font-semibold w-40 text-center'>{menu.name}</div>
          <div className="flex space-x-2 justify-center w-96"> 
            <button
              onClick={() => onEdit(index)}
              className="px-4 py-2 w-24 text-white bg-customblue hover:bg-blue-900 rounded-md shadow-lg cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => onRemove(index)}
              className="px-4 py-2 w-24 text-white bg-red-800 rounded-md cursor-pointer shadow-lg"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MenuCard