"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import NavBar from './NavBar';

const MenuType = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-white">
      <NavBar />
      <div className="absolute bottom-0 left-0 w-full h-16 bg-black rounded-t-[50%] z-0" />
      <div className="relative z-10 flex flex-col items-center px-6 py-8 h-full">
        <h1 className="text-customorange text-2xl font-bold mb-4">
          Select Menu
        </h1>
        <hr className="border-gray-300 w-full max-w-3xl mb-6" />
        <div className="flex-grow flex justify-center items-center w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Food Menu Card */}
            <div
              onClick={() => router.push('/menu/home/food')}
              className="relative rounded-xl overflow-hidden cursor-pointer 
                         border-2 border-customorange shadow-lg w-full aspect-square 
                         mx-auto transition-transform duration-300 hover:scale-105"
            >
              <img
                src="/assets/menus/food.jpg"
                alt="Food Menu"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-75" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-customGold text-2xl md:text-4xl lg:text-5xl font-semibold">
                  Food Menu
                </h2>
              </div>
            </div>

            {/* Bar Menu Card */}
            <div
              onClick={() => router.push('/menu/home/bar')}
              className="relative rounded-xl overflow-hidden cursor-pointer 
                         border-2 border-customorange shadow-lg w-full aspect-square 
                         mx-auto transition-transform duration-300 hover:scale-105"
            >
              <img
                src="/assets/menus/bar.jpg"
                alt="Bar Menu"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-customBeige text-2xl md:text-4xl lg:text-5xl font-semibold">
                  Bar Menu
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuType;
