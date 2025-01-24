"use client"
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { products } from "@/data/products";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import ProductsGrid from "@/components/ProductsGrid";
import Button from "@/components/Button";

const page = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [internalProducts, setInternalProducts] = useState(products)
    const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="p-4 min-h-screen bg-gradient-to-b from-[#EDD3B3] to-white">
        <div className="flex items-center justify-between mb-6">
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-2xl text-black"
            >
                <FiMenu/>
            </button>
            <h1 className="text-3xl font-bold text-black">Internal Food Item Management</h1>
            <SearchBar placeholder="Search Products" onSearch={setSearchQuery} />
        </div>
        <div className="flex space-x-4 mt-4 items-end justify-end w-full">
            <Button label="Add Product" variant="primary" link="/inventory/food/internal/create"/>
            <Button label="Update Product" variant="secondary" link=""/>
            <Button label="Remove" variant="secondary"/>
        </div>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>
        <ProductsGrid/>
        
    </div>
  )
}

export default page