// File: app/[name]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import MenuRow from "@/components/MenuSide/MenuRow";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCategory } from "@/redux/features/internalProductSlice";
import { setSelectedMenu } from "@/redux/features/menuSlice";
import MenuOverlay from "@/components/MenuSide/MenuOverlay";
import CartSection from "@/components/MenuSide/CartSection";

const CategoryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedMenu = useSelector(
    (state: RootState) => state.menuType.selectedMenu
  );
  const menus = useSelector((state:RootState) =>state.menuType.menus)
  const {internalFoods, loading, error} = useSelector(
    (state:RootState) => state.products
  );
  const [isOverlayOpen, setOverlayOpen] = useState(false);

  useEffect(()=>{
    if(selectedMenu){
      dispatch(fetchCategory({category:selectedMenu}));
    }
  }, [selectedMenu, dispatch]);

  const handleMenuSelect = (menu:string)=>{
    dispatch(setSelectedMenu(menu))
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <header className="mb-4 border-b-2 border-white pb-2">
        <h1 className="text-3xl font-bold text-white">{selectedMenu} Menu</h1>
      </header>
      <MenuRow
        menus={menus.map((menu) => menu.name)}
        onMenuSelect={console.log}
      />
      <MenuOverlay isOpen={isOverlayOpen} onClose={() => setOverlayOpen(false)}/>

        {loading?(
          <div className="text-white">Loading Products...</div>
        ): error ? (
          <div className="text-red-500">{error}</div>
        ): internalFoods.length === 0 ? (
          <div>Currently no items are available in this Menu</div>
        ):(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {internalFoods.map((food) =>(
              <ProductCard
                key={food.id}
                name={food.name}
                portions={food.sizes.map((size) => ({
                  size: size.size,
                  price:size.price
                }))}
                image={food.imageUrl}
              />
            ))}
          </div>
        )}
        <CartSection/>
    </div>
  );
};

export default CategoryPage;
