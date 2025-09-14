import React from 'react'
import { Transaction } from '@/redux/features/transactionSlice'

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const {
    ingredientName,
    category,
    transactionType,
    addedQuantity,
    quantity,
    newQuantity,
    remainingQuantity,
    date,
    unit,
    costPrice,
  } = transaction;

  const qtyDetails =
    transactionType === "StockIn"
      ? `Added: ${addedQuantity}`
      : `Deducted: ${quantity}`;
  const balance =
    transactionType === "StockIn"
      ? newQuantity
      : remainingQuantity;
  const bgColor = transactionType === "StockIn" ? "bg-green-200":"bg-green-100"

  return (
    <div className={`grid grid-cols-8 items-center border rounded-lg shadow-md p-4 mb-4 ${bgColor} transition-all duration-300 cursor-pointer`}>
      <div className="text-left text-gray-900 font-bold">{ingredientName}</div>
      <div className="text-left text-gray-900 font-bold">{category}</div>
      <div className="text-center text-gray-900 font-bold">{transactionType}</div>
      <div className="text-center text-gray-900 font-bold">{qtyDetails}</div>
      <div className="text-center text-gray-900 font-bold">{balance}</div>
      <div className="text-center text-gray-900 font-bold">{date}</div>
      <div className="text-center text-gray-900 font-bold">{unit}</div>
      <div className="text-center text-gray-900 font-bold">{costPrice}</div>
    </div>
  );
}

export default TransactionCard;
