"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu } from "react-icons/fi";
import ProductCard from "@/components/ProductCard";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchCategory } from "@/redux/features/internalProductSlice";
import { fetchMenusByType, Menu, setSelectedMenu } from "@/redux/features/menuSlice";
import MenuRow from "@/components/MenuSide/MenuRow";
import MenuOverlay from "@/components/MenuSide/MenuOverlay";
import NavBar from "@/components/MenuSide/NavBar";

const MenuPage = () => {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    setMounted(true);
    const storedMenu = localStorage.getItem("selectedMenu") || "";
    dispatch(setSelectedMenu(storedMenu));
  }, [dispatch]);
  const selectedMenu = useSelector((state: RootState) => state.menuType.selectedMenu);
  const menus = useSelector((state: RootState) => state.menuType.menus);
  const { internalFoods, loading, error } = useSelector((state: RootState) => state.products);
  const [isOverlayOpen, setOverlayOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMenusByType("Bar"));
  }, [dispatch]);

  // Fetch products for the selected menu
    useEffect(() => {
      if (selectedMenu) {
        dispatch(fetchCategory({ category: selectedMenu }));
      }
    }, [selectedMenu, dispatch]);
  
    // Now the handler accepts a Menu object instead of a string.
    const handleMenuSelect = (menu: Menu) => {
      dispatch(setSelectedMenu(menu.name));
    };
  
    // Convert the selected menu name to a full Menu object.
    const activeMenu = menus.find((menu) => menu.name === selectedMenu) || null;
  
    // Until the component is mounted, return null to avoid hydration mismatch.
    if (!mounted) {
      return null;
    }
  // Until the component is mounted, return null to avoid hydration mismatch.
  if (!mounted) {
    return null;
  }

  return (
    <div>
      <NavBar />
      <div className="p-2 bg-white min-h-screen">
        <header className="flex justify-between items-center mb-4 border-b-2 border-white">
          <h1 className="text-3xl font-bold text-customorange">{selectedMenu} Menu</h1>
          <button className="bg-transparent text-customorange p-2 rounded">
            <FiMenu size={24} onClick={() => setOverlayOpen(true)} />
          </button>
        </header>
        <MenuRow
          activeMenu={activeMenu}
          menus={menus}
          onMenuSelect={handleMenuSelect}
          selectedMenuType="Bar"
        />
        <MenuOverlay isOpen={isOverlayOpen} onClose={() => setOverlayOpen(false)} />
        {loading ? (
          <div className="text-black">Loading products...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : internalFoods.length === 0 ? (
          <div className="text-black">No Items in this menu at the moment..</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {internalFoods.map((food) => (
              <ProductCard
                key={food.id}
                name={food.name}
                portions={food.sizes.map((size) => ({
                  size: size.size,
                  price: size.price,
                }))}
                image={food.imageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
