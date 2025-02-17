import React from 'react'

interface StockOutCardProps {
  name: string;
  category: string;
  quantity: string;
  dateIn: string;
  reason: string;
}

const StockOutCard = ({ name, category, quantity, dateIn, reason }: StockOutCardProps) => {
  return (
    <div className="grid grid-cols-8 items-center border rounded-lg shadow-md p-4 mb-4 bg-white hover:bg-gray-300 transition-all duration-300 cursor-pointer">
      <div className="col-span-2 text-left text-gray-900 font-bold">{name}</div>
      <div className="col-span-1 text-left text-gray-900 font-bold">{category}</div>
      <div className="col-span-1 text-center text-gray-900 font-bold">{quantity}</div>
      <div className="col-span-2 text-center text-gray-900 font-bold">{reason}</div>
      <div className="col-span-2 text-center text-gray-900 font-bold">{dateIn}</div>
    </div>
  )
}

export default StockOutCard
