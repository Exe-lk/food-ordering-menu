"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import PortionPopUp from './MenuSide/PortionPopUp';


interface ProductCardProps {
    name: string;
    portions: {size: string; price:string}[];
    image:string;
}

const ProductCard = ({name, portions, image}:ProductCardProps) => {
    const [showPopup, setShowPopUp] = useState(false);
    const router = useRouter();

    // Products with AR models available
    const productsWithAR = [
        'Beef Tenderloin Greens Potatoes',
        'Black Bean Burgers',
        'Burger Onion Rings',
        'Burger With Garlic Mayo Ketchup Onion Jam',
        'Glazed Pork Rice',
        'Lil Cheese Pepperoni Pizza'
    ];

    const hasAR = productsWithAR.includes(name);

    const handleViewAR = () => {
        const url = `/menu/home/food/${encodeURIComponent(name)}/ar`;
        router.push(url);
    };

  return (
    <div className="relative rounded-3xl shadow-lg overflow-hidden mt-5">
            {/* Background Image */}
            <img src={image} alt={name} className="w-full h-56 object-cover" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0">
                {/* Text Content */}
                <div className="absolute bottom-0 p-3 sm:p-4 text-customGold w-full bg-overlayBack">
                    <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{name}</h3>
                    <div>
                        {portions.map((portion, index) => (
                            <p key={index} className="text-xs sm:text-sm">
                                {portion.size} : {portion.price} LKR
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2">
                {hasAR && (
                    <button 
                    onClick={handleViewAR}
                    className="bg-black text-white px-2 py-1 sm:px-4 sm:py-2 rounded shadow-lg text-xs sm:text-sm">
                        View AR
                    </button>
                )}
                <button 
                onClick={() => setShowPopUp(true)}
                className="bg-customGold text-white px-2 py-1 sm:px-4 sm:py-2 rounded shadow-lg text-xs sm:text-sm">
                    Add +
                </button>
            </div>
            {/* Portion Selection Pop UP */}
            {showPopup && (
                <PortionPopUp
                name={name}
                portions={portions}
                image={image}
                onClose={() => setShowPopUp(false)}  
                />
            )}
        </div>
  )
}

export default ProductCard