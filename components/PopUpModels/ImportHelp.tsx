import React from "react";
import { FiX } from "react-icons/fi";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportHelp = ({ isOpen, onClose }: HelpModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative bg-white w-[450px] rounded-lg shadow-lg p-6">
      
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl"
        >
          <FiX />
        </button>
        <h2 className="text-xl font-bold text-center text-black mb-6">
          Implement Structure
        </h2>
        <div className="space-y-2 text-black mb-6 font-semibold">
          <div>Id:</div>
          <div>Name:</div>
          <div>Category:</div>
          <div>Description:</div>
          <div>Image Url:</div>
          <div>Sizes:</div>
          <div>Is Deleted:</div>
          <div>Created At:</div>
          <div>Created By:</div>
        </div>

    
        <p className="text-center text-gray-700 mb-6 font-bold">
          To import make sure data are in this structure
        </p>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-customGold text-white px-6 py-2 rounded-md"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportHelp;
