import React from 'react'

interface supplier{
  name:string;
}
interface ExternalCardProps{
    category: string;
    brand: string;
    name: string;
    quantity: string;
    unit: string;
    manufactureDate: string;
    expiryDate: string;
    dateIn: string;
    costPrice: string;
    supplier: supplier[];
    description: string;
    onEdit:() => void;
    onRemove:() => void;
}

const ExternalCard = ({category, brand, name, quantity, dateIn, costPrice, supplier, onEdit, onRemove}:ExternalCardProps) => {
  return (
    <div className='grid grid-cols-9 items-center border rounded-lg shadow-md p-4 mb-4 bg-white hover:bg-gray-300 transition-all duration-300 cursor-pointer'>
        <div className='text-gray-900 font-bold items-center justify-center text-center'>
            {category}
        </div>
        <div className='text-gray-900 font-bold px-2 items-center justify-center text-center'>
            {brand}
        </div>
        <div className='text-gray-900 font-bold px-2 items-center justify-center text-center'>
            {name}
        </div>
        <div className='text-gray-900 font-bold px-2 items-center justify-center text-center'>
            {quantity}
        </div>
        <div className='text-gray-900 font-bold px-2 items-center justify-center text-center'>
            {dateIn}
        </div>
        <div className='text-gray-900 font-bold px-2 items-center justify-center text-center'>
            {costPrice}
        </div>
        <div className='text-gray-900 font-bold px-2 items-center justify-center text-center'>
            {supplier.map((sup, index) => (
              <div key={index} className='text-sm text-gray-800 text-center items-center justify-center border-l border-r border-gray-600'>
                {sup.name}
              </div>
            ))}
        </div>
        <div className="flex space-x-2 justify-center px-2">
        <button
          onClick={onEdit}
          className="px-4 py-2 w-24 text-white bg-customblue hover:bg-blue-900 rounded-md cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={onRemove}
          className="px-4 py-2 w-24 text-white bg-red-800 rounded-md"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default ExternalCard