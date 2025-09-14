"use client";
import React from "react";

interface HeadingProps{
  titles:string[];
}

const Heading = ({titles}:HeadingProps) => {
  return (
    <div className="flex justify-between px-4 py-3 bg-white text-customGold rounded-lg shadow-md pb-2 text-left font-semibold">
      {titles.map((title, index) =>(
         <div key={index} className="w-40 text-center">{title}</div>
      ))}
      <div className="w-96 text-center">Actions</div>
    </div>
  );
};

export default Heading;
