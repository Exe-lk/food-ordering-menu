"use client"
import { useParams } from "next/navigation";
import { products } from "@/data/products";
import CategoryRow from "../../_components/CategoryRow";
import ProductCard from "../../_components/ProductCard";
import { FiMenu } from "react-icons/fi";
import CartSection from "../_components/CartSection";
import { useState } from "react";
import MenuOverlay from "../../_components/MenuOverlay";

const MenuPage = () => {
  const params = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const selectedMenu = params.name as string;
  const menuProducts = products[selectedMenu];

  if (!menuProducts) {
    return <div className="p-4">No products found for this menu.</div>;
  }

  const categories = Array.from(new Set(menuProducts.map(product => product.category)));

  return (
    <div className="p-2 bg-cover bg-center bg-no-repeat" style={{backgroundImage:'url(/images/background/menuback.png)'}}>
      <header className="flex justify-between items-center mb-4 border-b-2 border-white">
        <h1 className="text-3xl font-bold">{selectedMenu}</h1>
        <button onClick={() => setIsMenuOpen(true)} className="bg-transparent p-2 rounded">
          <FiMenu size={24} />
        </button>
      </header>
      <CategoryRow categories={categories} />
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