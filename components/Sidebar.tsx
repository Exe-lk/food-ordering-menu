"use client"
import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi'

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SideBarProps) => {
    const [isFoodMenuOpen, setIsFoodMenuOpen] = useState(false);
    const [isIngredientsMenuOpen, setIsIngredientsMenuOpen] = useState(false);

    if (!isOpen) return null;
    return (
        <div className='fixed top-0 left-0 w-1/4 h-full bg-white shadow-lg z-50'>
            <div className='flex justify-end p-4'>
                <button
                    onClick={onClose}
                    className='text-black text-2xl'
                >
                    <FiX />
                </button>
            </div>
            <ul className='p-4 space-y-4'>
                <li>
                    <a href="/order"
                        className='block text-xl text-gray-800'
                    >
                        Order Management
                    </a>
                </li>
                <li>
                    <button
                        onClick={() => setIsFoodMenuOpen(!isFoodMenuOpen)}
                        className='w-full flex justify-between items-center text-xl text-gray-800'
                    >
                        Food Inventory
                        {isFoodMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    {isFoodMenuOpen && (
                        <ul className='pl-4 mt-2 space-y-4'>
                            <li>
                                <a href="/inventory/food/internal"
                                    className='block text-gray-800 text-lg'
                                >
                                    Internal
                                </a>
                            </li>
                            <li>
                                <a href="/inventory/food/external"
                                    className='block text-gray-800 text-lg'
                                >
                                    External
                                </a>
                            </li>
                        </ul>
                    )}
                </li>
                <li>
                    <a href="/portion"
                        className='block text-gray-800 text-xl'
                    >
                        Portion Management
                    </a>
                </li>
                <li>
                    <a href="/inventory/ingredients"
                        className='block text-gray-800 text-xl'
                    >
                        Ingredients Inventory
                    </a>
                </li>
                {/* <li>
                    <button
                        onClick={() => setIsIngredientsMenuOpen(!isIngredientsMenuOpen)}
                        className='w-full flex justify-between items-center text-xl text-gray-800'
                    >
                        Ingredients Inventory
                        {isIngredientsMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    {isIngredientsMenuOpen && (
                        <ul className='pl-4 mt-2 space-y-4'>
                            <li>
                                <a href="/inventory/ingredients/categories"
                                    className='block text-gray-800 text-lg'
                                >
                                    Ingredient Categories
                                </a>
                            </li>
                            <li>
                                <a href="/inventory/ingredients/items"
                                    className='block text-gray-800 text-lg'
                                >
                                    Ingredients
                                </a>
                            </li>
                        </ul>
                    )}
                </li> */}
                <li>
                    <a href="/menutype"
                        className='block text-gray-800 text-xl'
                    >
                        Menu Management
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar
