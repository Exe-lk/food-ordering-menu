import React from 'react'
import { MdOutlineModeEdit, MdDeleteOutline } from "react-icons/md";

interface ActionButtonsProps {
    onEdit: () => void;
    onRemove: () => void;
    buttonWidth?: string;
  }

const ActionButton = ({ onEdit, onRemove, buttonWidth = "w-16", }:ActionButtonsProps) => {
  return (
    <div className='flex space-x-2 justify-center'>
        <button
            onClick={onEdit}
            className={`flex items-center justify-center px-4 py-2 ${buttonWidth} text-white bg-customGold hover:bg-orange-900 rounded-md shadow-lg`}
        >
            <MdOutlineModeEdit/>
        </button>
        <button 
            onClick={onRemove}
            className={`flex items-center justify-center px-4 py-2 ${buttonWidth} text-white bg-customred shadow-lg rounded-md `}
        >
             <MdDeleteOutline/>
        </button>
    </div>
  )
}

export default ActionButton