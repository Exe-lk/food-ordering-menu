import React from 'react'

const StockInHeading = () => {
  return (
    <div className="grid grid-cols-8 items-center border bg-white text-customGold font-bold rounded-lg shadow-md mb-2 text-center py-4 px-2">
      <div className="text-left">Ingredient</div>
      <div className="text-left">Category</div>
      <div className="text-center">Type</div>
      <div className="text-center">Qty Details</div>
      <div className="text-center">Balance</div>
      <div className="text-center">Date</div>
      <div className="text-center">Unit</div>
      <div className="text-center">Cost Price</div>
    </div>
  );
}

export default StockInHeading;
