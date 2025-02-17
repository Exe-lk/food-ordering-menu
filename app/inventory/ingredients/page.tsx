"use client"
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import Confirm from "@/components/PopUpModels/Confirm";
import Button from "@/components/Button";
import IngredientsHeading from "@/components/Headings/IngredientsHeading";
import IngredientCard from "@/components/Inventory/IngredientCard";
import { fetchIngredients, Ingredient, removeIngredient } from "@/redux/features/ingredientsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import IngredientCreate from "@/components/PopUpModels/IngredientCreate";
import StockIn from "@/components/PopUpModels/StockIn";
import StockOut from "@/components/PopUpModels/StockOut";
import RecycleModal from "@/components/RecycleModal";
import RecycleBinButton from "@/components/RecycleBin";


const page = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isStockOpen, setIsStockOpen] = useState(false);
    const [isStockOutOpen, setIsStockOutOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Ingredient | null>(null);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{
      ingredientId: string;
      ingredientName:string;
      category:string;
    } | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const {ingredients, loading, error} = useSelector((state:RootState) => state.ingredients)
    const filteredIngredients = ingredients.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    useEffect(() =>{
      dispatch(fetchIngredients())
    },[dispatch])
    const handleEdit = (productId: string) =>{
      const ingredient = ingredients.find((p) => p.id === productId);
      if(ingredient){
        setSelectedProduct(ingredient);
        setIsEditPopupOpen(true);
      }
    }
    const handleStockOut = (id:string)=>{
      const ingredient = ingredients.find((p) => p.id === id);
      if(ingredient){
        setSelectedItem({
          ingredientId:ingredient.id,
          ingredientName:ingredient.name,
          category:ingredient.category
        });
        setIsStockOutOpen(true);
      }
    }
    
    const handleStockIn = (id: string) => {
      const ingredient = ingredients.find((p) => p.id === id);
      if (ingredient) {
        setSelectedItem({
          ingredientId: ingredient.id,
          ingredientName: ingredient.name,
          category: ingredient.category,
        });
        setIsStockOpen(true);
      }
    };
    
    const handleRemove = (id:string)=>{
      setSelectedProductId(id);
      setIsConfirmOpen(true);
    }

    const confirmRemove= async()=>{
      if(selectedProductId){
        await dispatch(removeIngredient({id:selectedProductId}));
        dispatch(fetchIngredients());
        setIsConfirmOpen(false);
        setSelectedProductId(null)
      }
    }
  return (
    <div className="flex">
      <Sidebar/>
      <div className="p-4 h-screen bg-beige ml-14 w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-customblue">Ingredients Management</h1>
          <SearchBar placeholder="Search Ingredients" onSearch={setSearchQuery}/>
        </div>
        <div className="flex space-x-4 items-start justify-start w-full mb-3">
          <Button onClick={() => setIsPopupOpen(true)} label="Create Ingredient" variant="primary"/>
        </div>
        <IngredientsHeading/>
        <div className="mt-4">
        {loading ? (
            <p className="text-black">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredIngredients.length > 0 ? (
            filteredIngredients.map((product) => (
              <IngredientCard
                key={product.id}
                category={product.category}
                productName={product.name}
                quantity={product.quantity} 
                dateIn={product.dateIn}
                costPrice={product.costPrice}
                supplier={product.supplier}
                onStockIn={() => handleStockIn(product.id)}
                onStockOut={() => handleStockOut(product.id)}
                onEdit={() => handleEdit(product.id)}
                onRemove={() => handleRemove(product.id)}
              />
            ))
          ) : (
            <p className="text-black">
              {searchQuery ? "No Products found" : "No Products Available"}
            </p>
          )}
        </div>
        <div>
          <RecycleBinButton onClick={() => setIsRecycleBinOpen(true)}/>
          <IngredientCreate isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}/>
          <Confirm message="Are you sure you want to remove the ingredient?" isOpen={isConfirmOpen} onClose={()=> setIsConfirmOpen(false)} onConfirm={confirmRemove}/>
            {selectedItem &&(
              <StockIn
                isOpen={isStockOpen}
                ingredientId={selectedItem.ingredientId}
                onClose={() => setIsStockOpen(false)}
                ingredientName={selectedItem.ingredientName}
                category={selectedItem.category}
              />
            )}
            {selectedItem &&(
              <StockOut
                isOpen={isStockOutOpen}
                ingredientId={selectedItem.ingredientId}
                onClose={() => setIsStockOutOpen(false)}
                ingredientName={selectedItem.ingredientName}
                category={selectedItem.category}
              />
            )}

            <RecycleModal isOpen={isRecycleBinOpen} onClose={() => setIsRecycleBinOpen(false)} recycleType="ingredient"/>
        </div>
      </div>
    </div>
  )
}

export default page