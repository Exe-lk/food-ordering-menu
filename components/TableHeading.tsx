import React from "react";

const TableHeading = () => {
  return (
    <div className="flex justify-between items-center bg-customgray rounded-lg shadow-md px-4 py-3">
      <div className="flex-1 text-center font-semibold text-gray-800">Table</div>
      <div className="flex-1 text-center font-semibold text-gray-800">Items</div>
      <div className="flex-1 text-center font-semibold text-gray-800">Status</div>
    </div>
  );
};

export default TableHeading;
