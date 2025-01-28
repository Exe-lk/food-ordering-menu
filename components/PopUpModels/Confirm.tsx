"use client"
import React from 'react'

interface ConfirmProps{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message?:string;
}

const Confirm = ({isOpen, onClose, onConfirm, message}:ConfirmProps) => {
    if(!isOpen) return null;
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='bg-white p-6 rounded-lg shadow-lg'>
            <p className='text-gray-900 font-semibold text-lg'>{message}</p>
            <div className='flex justify-center space-x-4 mt-4'>
                <button 
                    onClick={onConfirm}
                    className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-800 cursor-pointer'>
                    Remove
                </button>
                <button
                    onClick={onClose}
                    className='px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-200 cursor-pointer text-black'
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
  )
}

export default Confirm