"use client"
import React,{useState} from 'react'
import {FiChevronDown, FiChevronUp} from 'react-icons/fi'

interface SideBarProps{
    isOpen: boolean;
    onClose: () => void;
}


const Sidebar = ({isOpen, onClose}:SideBarProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if(!isOpen) return null;
  return (
    <div className='fixed top-0 left-0 w-1/4 h-full bg-white shadow-lg z-50'>
        <div className='flex justify-end p-4'>
            <button
                onClick={onClose}
                className='text-black text-xl'
            >
                X
            </button>
        </div>
        <ul className='p-4 space-y-4'>
            <li>
                <a href="#"
                className='block text-lg text-gray-800'
                >
                    Order Management
                </a>
            </li>
            <li>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className='w-full flex justify-between items-center text-lg text-gray-800'
                >
                    Food Inventory
                    {isMenuOpen ? <FiChevronUp/> : <FiChevronDown/>}
                </button>
                {isMenuOpen && (
                    <ul className='pl-4 mt-2 space-y-4'>
                        <li>
                           <a href="#"
                            className='block text-gray-800'
                           >
                                Internal
                            </a> 
                        </li>
                        <li>
                            <a href=""
                            className='block text-gray-800'
                            >
                                External
                            </a>
                        </li>
                    </ul>
                )}
            </li>
            <li>
                <a href="#"
                className='block text-lg text-gray-800'
                >
                    Portion Management
                </a>
            </li>
        </ul>

    </div>
  )

}

export default Sidebar