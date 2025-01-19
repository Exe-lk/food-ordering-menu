"use client"
import { useParams } from "next/navigation";
import { products } from "@/data/products";
import { FiMenu } from "react-icons/fi";
import CartSection from "../_components/CartSection";
import { useState } from "react";
import MenuOverlay from "../_components/MenuOverlay";
import menuData from "@/data/menus";
import MenuRow from "../_components/MenuRow";
import ProductCard from "../_components/ProductCard";

const MenuPage = () => {
  const params = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const selectedMenu = params.name as string;
  const menuProducts = products[selectedMenu];
  const menus = menuData.map((menu) => menu.name);
  return (
    <div className="p-2 bg-black">
      <header className="flex justify-between items-center mb-4 border-b-2 border-white">
        <h1 className="text-3xl font-bold">Menus</h1>
        {/* Menu Overlay Button */}
        <button onClick={() => setIsMenuOpen(true)} className="bg-transparent p-2 rounded">
          <FiMenu size={24} />
        </button>
      </header>
      {/* Menus */}
      <MenuRow categories={menus} />
      <h1 className="text-center text-white text-xl">{selectedMenu}</h1>
      {/* Products */}
      <div>
        {menuProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
      <CartSection/>
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};
export default MenuPage;