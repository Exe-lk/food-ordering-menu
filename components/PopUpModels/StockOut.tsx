"use client"
import React,{useState} from 'react'
import { FiX } from 'react-icons/fi';

interface StockInProps {
    isOpen: boolean;
    onClose: () => void;
    ingredientName: string;
    category: string;
  }

const StockOut = ({isOpen, onClose, ingredientName, category}:StockInProps) => {
    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("");
    const [dateOut, setDateOut] = useState("");

    if(!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-85 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto hide-scrollbar max-w-md relative">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
                <FiX />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-customblue">Stock Out</h2>
            <form action="#">
                <div className="grid grid-cols-2 gap-4 mb-4 text-customblue">
                    <div className="col-span-2">
                        <label htmlFor="#" className="block font-semibold mb-1">
                            Ingredient Name
                        </label>
                        <input
                            type="text"
                            value={ingredientName}
                            readOnly
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="#">Category</label>
                        <input
                            type="text"
                            value={category}
                            readOnly
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="#" className="block font-semibold mb-1">
                            Quantity
                        </label>
                        <input
                            type="text"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-2 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="#" className="block font-semibold mb-1">
                            Date Out
                        </label>
                        <input
                            type="date"
                            value={dateOut}
                            onChange={(e) => setDateOut(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="#" className="block font-semibold mb-1 text-customblue">
                        Reason
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        rows={4}
                    />
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="px-4 py-2 text-white bg-customorange hover:bg-orange-400"
                    >
                        Stock Out
                    </button>
                </div>
            </form>
        </div>
    </div>

  )
}

export default StockOut