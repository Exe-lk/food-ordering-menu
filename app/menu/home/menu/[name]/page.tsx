"use client";

import { useParams } from "next/navigation";
import { products } from "@/data/products";
import { FiMenu } from "react-icons/fi";
import CartSection from "../../../../../components/CartSection";
import { useState, useEffect } from "react";
import MenuOverlay from "../../../../../components/MenuOverlay";
import menuData from "@/data/menus";
import MenuRow from "../../../../../components/MenuRow";
import ProductCard from "../../../../../components/ProductCard";

const MenuPage = () => {
  const params = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Extract selected menu from the URL parameter
  const selectedMenuFromParams = params?.name as string; // Ensure the param name matches
  const menus = menuData.map((menu) => menu.name);

  // Handle state for selected menu
  const [selectedMenu, setSelectedMenu] = useState(selectedMenuFromParams || menus[0]);

  // Update selectedMenu whenever params change
  useEffect(() => {
    if (selectedMenuFromParams) {
      setSelectedMenu(selectedMenuFromParams);
    }
  }, [selectedMenuFromParams]);

  const menuProducts = products[selectedMenu] || [];

  return (
    <div className="p-2 bg-black">
      <header className="flex justify-between items-center mb-4 border-b-2 border-white">
        <h1 className="text-3xl font-bold text-white">Menus</h1>
        {/* Menu Overlay Button */}
        <button onClick={() => setIsMenuOpen(true)} className="bg-transparent p-2 rounded">
          <FiMenu size={24} color="white" />
        </button>
      </header>
      {/* Menus */}
      <MenuRow menus={menus} onMenuSelect={setSelectedMenu} />
      <div>
        <h1 className="text-center text-white text-xl">{selectedMenu}</h1>
        {/* Products */}
        <div>
          {menuProducts.length > 0 ? (
            menuProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))
          ) : (
            <p className="text-center text-white text-lg">Menu is Empty</p>
          )}
        </div>
        <CartSection />
        <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    </div>
  );
};

export default MenuPage;
