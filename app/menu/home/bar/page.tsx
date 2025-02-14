"use client";
import React from "react";
import { useRouter } from "next/navigation";
import menuData from "@/data/menus";

const Page = () => {
  const router = useRouter();

  
  const handleMenuClick = (menuName: string) => {
    router.push(`/menu/home/bar/${menuName}`);
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen p-6 w-full">
      <h1 className="text-white text-2xl font-bold mb-4 md:text-4xl lg:text-6xl">
        Menus
      </h1>
      <hr className="border-gray-700 w-full mb-6" />
      <div className="grid grid-cols-2 gap-1 lg:gap-2 w-[95%] justify-center items-center">
        {menuData.map((item) => (
          <div
            key={item.id}
            className="relative rounded-sm overflow-hidden cursor-pointer"
            onClick={() => handleMenuClick(item.name)}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-28 md:h-48 lg:h-60 object-cover brightness-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-lg md:text-3xl lg:text-5xl font-semibold">
                {item.name}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
