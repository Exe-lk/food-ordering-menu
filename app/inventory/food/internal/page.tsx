"use client"
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { products } from "@/data/products";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/Button";
import TableHeading from "@/components/Headings/TableHeading";

import InternalCard from "@/components/Inventory/InternalCard";
import Create from "@/components/PopUpModels/Create";
import Confirm from "@/components/PopUpModels/Confirm";

const page = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [internalProducts, setInternalProducts] = useState(products)
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const handleEdit = (productId: number) =>{
        // 
    }
    const handleRemove = (productId: number) =>{
        setSelectedProductId(productId);
        setIsConfirmOpen(true);
    }

    const confirmRemove = () => {
        if (selectedProductId !== null) {
          setInternalProducts((prev) => {
            const updatedProducts = Object.fromEntries(
              Object.entries(prev).map(([key, category]) => [
                key,
                category.filter((product) => product.id !== selectedProductId),
              ])
            );
            return updatedProducts;
          });
      
          setIsConfirmOpen(false);
          setSelectedProductId(null);
        }
      };
      
  return (
    <div className="p-4 min-h-screen bg-beige">
        <div className="flex items-center justify-between mb-6">
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-2xl text-customblue"
            >
                <FiMenu/>
            </button>
            <h1 className="text-3xl font-bold text-customblue">Internal Food Item Management</h1>
            <SearchBar placeholder="Search Products" onSearch={setSearchQuery} />
        </div>
        <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
         />
        <div className="flex space-x-4 mt-4 items-start justify-start w-full mb-3">
            <Button onClick={()=> setIsPopupOpen(true)} label="Create Item" variant="primary"/>
        </div>
        <TableHeading headings={["Name","Portion & Price", "Description", "Actions"]}/>
        <div className="mt-4">
            {Object.values(internalProducts).flatMap((category) =>
            category.map((product) =>(
                <InternalCard
                    key={product.id}
                    name={product.name}
                    description={product.description}
                    portions={product.portions}
                    onEdit={() => handleEdit(product.id)}
                    onRemove={() => handleRemove(product.id)}
                />
            ))
            )}
        </div>
        <Create isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}/>
        <Confirm message="Are you sure you want to remove the product?" isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={confirmRemove}/>
    </div>
  )
}

export default page