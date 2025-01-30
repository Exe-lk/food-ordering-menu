import React from 'react'

interface IngredientCardProps{
    category:string;
    productName: string;
    quantity:string;
    dateIn:string;
    costPrice:string;
    supplier:string;
    onEdit:() => void;
    onRemove:() => void;
}

const IngredientCard = ({category, productName, quantity,dateIn,costPrice,supplier, onEdit, onRemove}:IngredientCardProps) => {
  return (
    <div className="grid grid-cols-10 items-center border rounded-lg shadow-md p-4 mb-4 bg-white hover:bg-gray-300 transition-all duration-300 cursor-pointer">
      <div className="text-gray-900 font-bold text-justify">{category}</div>
      <div className="text-gray-900 font-bold text-justify">{productName}</div>
      <div className="text-gray-900 font-bold text-center">{quantity}</div>
      <div className="text-gray-900 font-bold text-justify">{dateIn}</div>
      <div className="text-gray-900 font-bold text-justify">{costPrice}</div>
      <div className="text-gray-900 font-bold text-justify">{supplier}</div>
      <div className="col-span-2 flex items-center justify-center space-x-2">
        <button className="px-4 py-2 text-white bg-customgreen hover:bg-green-600 rounded-md w-32">
          Stock In
        </button>
        <button className="px-4 py-2 text-white bg-customorange hover:bg-orange-400 rounded-md w-32">
          Stock Out
        </button>
      </div>
      <div className="col-span-2 flex items-center justify-center space-x-2">
        <button
          onClick={onEdit}
          className="px-4 py-2 text-white bg-customblue hover:bg-blue-900 rounded-md w-24"
        >
          Edit
        </button>
        <button
          onClick={onRemove}
          className="px-4 py-2 text-white bg-red-800 hover:bg-red-600 rounded-md w-24"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default IngredientCard