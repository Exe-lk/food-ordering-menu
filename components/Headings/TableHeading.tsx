import React from "react";

interface TableHeadingProps {
  headings: string[];
}

const TableHeading = ({ headings }: TableHeadingProps) => {
  return (
    <div className="flex justify-evenly items-baseline bg-customgray rounded-lg shadow-md px-4 py-3">
      {headings.map((heading, index) => (
        <div key={index} className="flex-1 text-center font-semibold text-gray-800 ">
          {heading}
        </div>
      ))}
    </div>
  );
};

export default TableHeading;
