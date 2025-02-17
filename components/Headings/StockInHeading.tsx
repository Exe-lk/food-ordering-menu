import React from 'react'

const StockInHeading = () => {
  return (
    <div className="grid grid-cols-8 items-center border bg-gray-200 text-gray-900 font-bold rounded-lg shadow-md mb-2 text-center py-4 px-2">
        <div className="text-left">Product Name</div>
        <div className="text-left">Category</div>
        <div className="text-center">Quantity</div>
        <div className="text-left">Supplier</div>
        <div className="text-center">Date In</div>
        <div className="text-center">Unit</div>
        <div className="text-center">Cost Price</div>
        <div className="text-left">Brand</div>
    </div>
  )
}

export default StockInHeading
