import React from "react";
import { FiTrash2 } from "react-icons/fi";

interface RecycleBinButtonProps {
  onClick: () => void;
}

const RecycleBinButton = ({ onClick }: RecycleBinButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 bg-[#1F3A68] text-white px-4 py-2 rounded-md mt-5"
    >
      <FiTrash2 className="w-5 h-5" />
      <span>Recycle Bin</span>
    </button>
  );
};

export default RecycleBinButton;
