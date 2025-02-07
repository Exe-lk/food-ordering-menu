// src/app/MenuPage.tsx
"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu } from "react-icons/fi";
import CartSection from "@/components/CartSection";
import ProductCard from "@/components/ProductCard";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchCategory } from "@/redux/features/internalProductSlice";

const MenuPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Get the selected menu name from Redux
  const selectedMenu = useSelector(
    (state: RootState) => state.menuType.selectedMenu
  );
  // Get the products state from the internalFood slice
  const { internalFoods, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  // Whenever the selected menu changes, fetch products for that category
  useEffect(() => {
    if (selectedMenu) {
      dispatch(fetchCategory({ category: selectedMenu }));
    }
  }, [selectedMenu, dispatch]);

  return (
    <div className="p-2 bg-black min-h-screen">
      <header className="flex justify-between items-center mb-4 border-b-2 border-white">
        <h1 className="text-3xl font-bold text-white">{selectedMenu} Menu</h1>
        <button className="bg-transparent p-2 rounded">
          <FiMenu size={24} color="white" />
        </button>
      </header>
      {loading ? (
        <div className="text-white">Loading products...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : internalFoods.length === 0 ? (
        <div className="text-white">No products found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {internalFoods.map((food) => (
            <ProductCard
              key={food.id}
              name={food.name}
              // Map the sizes array to portions (if needed)
              portions={food.sizes.map((size) => ({
                size: size.size,
                price: size.price,
              }))}
              image={food.imageUrl}
            />
          ))}
        </div>
      )}
      <CartSection />
    </div>
  );
};

export default MenuPage;
