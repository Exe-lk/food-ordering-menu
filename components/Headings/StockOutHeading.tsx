import React from 'react'

const StockOutHeading = () => {
  return (
    <div className="grid grid-cols-8 items-center border bg-gray-200 text-gray-900 font-bold rounded-lg shadow-md mb-2 text-center py-4 px-2">
      <div className="col-span-2 text-left">Product Name</div>
      <div className="col-span-1 text-left">Category</div>
      <div className="col-span-1 text-center">Quantity</div>
      <div className="col-span-2 text-center">Reason</div>
      <div className="col-span-2 text-center">Date In</div>
    </div>
  )
}

export default StockOutHeading
