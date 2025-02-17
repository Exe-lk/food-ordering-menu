import React from 'react'

interface StockInCardProps {
  name: string;
  category: string;
  quantity: string;
  supplier: string;
  dateIn: string;
  unit: string;
  costPrice: string;
  brand: string;
}

const StockInCard = ({
  name,
  category,
  quantity,
  supplier,
  dateIn,
  unit,
  costPrice,
  brand,
}: StockInCardProps) => {
  return (
    <div className="grid grid-cols-8 items-center border rounded-lg shadow-md p-4 mb-4 bg-white hover:bg-gray-300 transition-all duration-300 cursor-pointer">
        <div className="text-left text-gray-900 font-bold">{name}</div>
        <div className="text-left text-gray-900 font-bold">{category}</div>
        <div className="text-center text-gray-900 font-bold">{quantity}</div>
        <div className="text-left text-gray-900 font-bold">{supplier}</div>
        <div className="text-center text-gray-900 font-bold">{dateIn}</div>
        <div className="text-center text-gray-900 font-bold">{unit}</div>
        <div className="text-center text-gray-900 font-bold">{costPrice}</div>
        <div className="text-left text-gray-900 font-bold">{brand}</div>
    </div>
  )
}

export default StockInCard
