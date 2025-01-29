"use client"
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { external } from "@/data/external";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import ExternalCard from "@/components/Inventory/ExternalCard";
import ExternalHeading from "@/components/ExternalHeading";
import External from "@/components/PopUpModels/External";
const page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [externalProducts, setExternalProducts] = useState(external)
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
    setExternalProducts((prev) => 
      prev.filter((product) => product.id !== selectedProductId)
    );

    setIsConfirmOpen(false);
    setSelectedProductId(null);
  }
};


  return (
    <div className="p-4 h-screen bg-beige">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setIsSidebarOpen(true)} className="text-2xl text-customblue">
          <FiMenu/>
        </button>
        <h1 className="text-3xl font-bold text-customblue">External Food Item Management</h1>
        <SearchBar placeholder="Search Product" onSearch={setSearchQuery}/>
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex space-x-4 mt-4 items-start justify-start w-full mb-3">
        <Button onClick={() => setIsPopupOpen(true)} label="Create Item" variant="primary"/>
      </div>
      <ExternalHeading/>
      <div className="mt-4">
        {externalProducts.map((product) =>(
          <ExternalCard
          key={product.id}
            category={product.category}
            brand={product.brand}
            productName={product.productName}
            quantity={product.quantity}
            unit={product.unit}
            manufactureDate={product.manufactureDate}
            expireDate={product.expireDate}
            dateIn={product.dateIn}
            costPrice={product.costPrice}
            supplier={product.supplier}
            description={product.description}
            onEdit={() => handleEdit(product.id)}
            onRemove={() => handleRemove(product.id)}
          />
        ))}
      </div>
      <External isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}/>
    </div>
  )
}

export default page