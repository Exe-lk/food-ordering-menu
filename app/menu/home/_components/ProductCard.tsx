"use client"
import React, { useState } from 'react'
import PortionPopUp from '../menu/_components/PortionPopUp';
interface ProductCardProps {
    name: string;
    portions: {size: string; price:string}[];
    image:string;
}

const ProductCard = ({name, portions, image}:ProductCardProps) => {
    const [showPopup, setShowPopUp] = useState(false);
  return (
    <div className="relative rounded-lg shadow-lg overflow-hidden mt-5">
            {/* Background Image */}
            <img src={image} alt={name} className="w-full h-56 object-cover" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent">
                {/* Text Content */}
                <div className="absolute bottom-0 p-4 text-white w-full">
                    <h3 className="font-bold text-lg mb-2">{name}</h3>
                    <div>
                        {portions.map((portion, index) => (
                            <p key={index} className="text-sm">
                                {portion.size} : {portion.price} LKR
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Button */}
            <button 
            onClick={() => setShowPopUp(true)}
            className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
                Add +
            </button>
            {showPopup && (
                <PortionPopUp 
                name={name}
                portions={portions}
                onClose={() => setShowPopUp(false)}  
                />
            )}
        </div>
  )
}

export default ProductCard