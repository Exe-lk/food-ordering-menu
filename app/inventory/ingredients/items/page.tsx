"use client"
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { ingredients } from "@/data/ingredients";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import Confirm from "@/components/PopUpModels/Confirm";
import Button from "@/components/Button";
import IngredientsHeading from "@/components/Headings/IngredientsHeading";
import IngredientCard from "@/components/Inventory/IngredientCard";
import IngredientCreate from "@/components/PopUpModels/IngredientCreate";


const page = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [ingredientItems, setIngredientItems] = useState(ingredients)
    const [searchQuery, setSearchQuery] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const handleEdit = (productId: number) =>{
        // 
    }



    const handleRemove = (productId:number)=>{
      setSelectedProductId(productId)
      setIsConfirmOpen(true)
    }

    const confirmRemove=()=>{
      setIsConfirmOpen(false);
      setSelectedProductId(null);
    }
  return (
    <div className="p-4 h-screen bg-beige">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setIsSidebarOpen(true)} className="text-2xl text-customblue">
          <FiMenu/>
        </button>
        <h1 className="text-3xl font-bold text-customblue">Ingredients Management</h1>
        <SearchBar placeholder="Search Ingredients" onSearch={setSearchQuery}/>
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex space-x-4 items-start justify-start w-full mb-3">
        <Button onClick={() => setIsPopupOpen(true)} label="Create Ingredient" variant="primary"/>
      </div>
      <IngredientsHeading/>
      <div className="mt-4">
        {ingredientItems.map((item) =>(
          <IngredientCard
          key={item.id}
          category={item.category}
          productName={item.productName}
          quantity={item.quantity}
          dateIn={item.dateIn}
          costPrice={item.costPrice}
          supplier={item.supplier}
          onEdit={()=>handleEdit(item.id)}
          onRemove={() => handleRemove(item.id)}
          />
        ))}
      </div>
      <div>
        <IngredientCreate isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}/>
        <Confirm message="Are you sure you want to remove the ingredient?" isOpen={isConfirmOpen} onClose={()=> setIsConfirmOpen(false)} onConfirm={confirmRemove}/>
      </div>
    </div>
  )
}

export default page