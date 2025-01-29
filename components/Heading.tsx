"use client";
import React from "react";

const Heading = () => {
  return (
    <div className="flex justify-between px-4 py-3 bg-customgray rounded-lg shadow-md pb-2 text-left font-semibold text-gray-800">
      <div className="w-40 text-center">Portion Size</div>
      <div className="w-40 text-center">Served Number</div>
      <div className="w-96 text-center">Actions</div>
    </div>
  );
};

export default Heading;
