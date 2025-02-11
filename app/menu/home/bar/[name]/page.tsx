// File: app/[name]/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import menuData from "@/data/menus";
import MenuRow from "@/components/MenuSide/MenuRow";


const categoryMapping: Record<string, string> = {
  "Cocktails": "Cocktails",
  "Beer": "Beers",
  "Wines": "Wines",
  "Spirits": "Spirits",
};

const CategoryPage = () => {
  const params = useParams();
  const menuName = params.name as string;
  const categoryKey = categoryMapping[menuName] || menuName;
  const categoryProducts = products[categoryKey] || [];

  return (
    <div className="min-h-screen bg-black p-4">
      <header className="mb-4 border-b-2 border-white pb-2">
        <h1 className="text-3xl font-bold text-white">{menuName} Menu</h1>
      </header>
      <MenuRow
        menus={menuData.map((menu) => menu.name)}
        onMenuSelect={console.log}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryProducts.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            portions={product.portions}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
