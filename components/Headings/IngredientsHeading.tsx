import React from "react";

const IngredientsHeading = () => {
  return (
    <div className="grid grid-cols-7 items-center border bg-black text-customGold font-bold rounded-lg shadow-md mb-2 text-center py-4 px-2">
      <div className="text-left">Category</div>
      <div className="text-justify">Product Name</div>
      <div className="text-center">Quantity</div>
      <div className="text-center col-span-2">Stock Action</div>
      <div className="text-center col-span-2">Actions</div>
    </div>
  );
};

export default IngredientsHeading;
