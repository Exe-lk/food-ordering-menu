import React from "react";
import { FiTrash2 } from "react-icons/fi";

interface RecycleBinButtonProps {
  onClick: () => void;
}

const RecycleBinButton = ({ onClick }: RecycleBinButtonProps) => {
  return (
    <button
      onClick={onClick}
      title="Open Recycle Bin"
      className="flex items-center space-x-2 bg-customGold text-white px-4 py-2 rounded-md mt-5"
    >
      <FiTrash2 className="w-5 h-5" />
      <span>Recycle Bin</span>
    </button>
  );
};

export default RecycleBinButton;
