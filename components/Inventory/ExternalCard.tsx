import React from 'react'

interface ExternalCardProps{
    category: string;
    brand: string;
    productName: string;
    quantity: number;
    unit: string;
    manufactureDate: string;
    expireDate: string;
    dateIn: string;
    costPrice: number;
    supplier: string;
    description: string;
    onEdit:() => void;
    onRemove:() => void;
}

const ExternalCard = ({category, brand, productName, quantity, dateIn, costPrice, supplier, onEdit, onRemove}:ExternalCardProps) => {
  return (
    <div className='grid grid-cols-9 items-center border rounded-lg shadow-md p-4 mb-4 bg-white hover:bg-gray-300 transition-all duration-300 cursor-pointer'>
        <div className='text-gray-900 font-bold items-center justify-center text-center'>
            {category}
        </div>
        <div className='text-gray-900 font-bold px-2 items-center justify-center text-center'>
            {brand}
        </div>
        <div className='text-gray-900 font-bold px-2 items-center justify-center text-center'>
            {productName}
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
            {supplier}
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