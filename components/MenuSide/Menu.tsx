// src/app/Menu.tsx
"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchMenus, fetchMenusByType, resetFetched, setSelectedMenu } from "@/redux/features/menuSlice";
import { RootState } from "@/redux/store";
import NavBar from "./NavBar";

interface MenuProps {
  type: string;
}

const Menu = ({type}:MenuProps) => {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const { menus, loading, fetched } = useSelector(
    (state: RootState) => state.menuType
  );

  useEffect(() => {
    dispatch(resetFetched());
    dispatch(fetchMenusByType(type));
  }, [dispatch, type]);
  

  const handleMenuClick = (name: string) => {
    dispatch(setSelectedMenu(name));
    router.push(`/menu/home/${type.toLowerCase()}/${name}`);
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white text-black">
        Loading...
      </div>
    );
  }
  return (
    <div>
      <NavBar/>
      <div className="flex relative flex-col items-center bg-white min-h-screen p-6 w-full">
        <h1 className="text-customGold text-2xl font-bold mb-4 md:text-4xl lg:text-6xl">
          Menus
        </h1>
        <hr className="border-gray-700 w-full mb-6" />
        <div className="grid grid-cols-2 gap-1 lg:gap-2 w-[95%] justify-center items-center z-10">
          {menus.map((item) => (
            <div
              key={item.id}
              className="relative rounded-sm overflow-hidden cursor-pointer"
              onClick={() => handleMenuClick(item.name)}
            >
              <img
                src={item.imageUrl}
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
        <div className="absolute bottom-0 left-0 w-full h-16 bg-white rounded-t-[50%] z-0" />
      </div>
    </div>
  );
};

export default Menu;
