"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/Button";
import CategoryCard from "@/components/Inventory/CategoryCard";
import CategoryCreate from "@/components/PopUpModels/CategoryCreate";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchCategories, removeCategory } from "@/redux/features/ingredientCategorySlice";
import RecycleBinButton from "@/components/RecycleBin";
import RecycleModal from "@/components/RecycleModal";
import Heading from "@/components/Headings/Heading";
import CategoryEdit from "@/components/PopUpModels/EditPopUps/CategoryEdit";
import Confirm from "@/components/PopUpModels/Confirm";
const page = () => {
  const dispatch = useDispatch<any>();
  const {categories, loading, fetched, error} = useSelector((state:RootState) => state.categories)
  const [localCategories, setLocalCategories] = useState(categories);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);

  useEffect(() =>{
    if(!fetched){
      dispatch(fetchCategories());
    }
  },[fetched,dispatch]);
  useEffect(() => {
    if(categories.length > 0){
      setLocalCategories(categories)
    }
  },[categories]);

  const handleEdit = (index: number) => {
    setSelectedIndex(index)
    setIsEditOpen(true);
  };

  const handleRemove = (index: number) => {
    setSelectedIndex(index);
    setIsConfirmOpen(true);
  };

  const filtredCategories = localCategories.filter((category) =>
  category.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const confirmRemove = async () =>{
    if(selectedIndex !== null){
      try {
        await dispatch(removeCategory({id:localCategories[selectedIndex].id})).unwrap();
        dispatch(fetchCategories());
        setIsConfirmOpen(false);
        setSelectedIndex(null);
      } catch (error) {
        console.error("Error Removing Category:", error);
      }
    }
  }
  return (
    <div className="flex">
      <Sidebar/>
      <div className="p-4 min-h-screen bg-beige ml-14 w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-customblue">Category Management</h1>
          <SearchBar placeholder="Search Categories" onSearch={setSearchQuery}/>
      </div>
      <div className="flex space-x-4 mt-4 items-start justify-start w-full mb-3">
        <Button label="Create Category" variant="primary" onClick={() => setIsPopupOpen(true)} />
      </div>
      <Heading titles={["Category Name"]}/>

      {loading ?(
        <p className="text-black">Loading..</p>
      ):filtredCategories.length > 0 ?(
        <CategoryCard categories={filtredCategories} onEdit={handleEdit} onRemove={handleRemove}/>
      ):(
        <p className="text-black">
          {searchQuery ? "No Categories foubd":"No categories available"}
        </p>
      )}
      <RecycleBinButton onClick={() => setIsRecycleBinOpen(true)}/>
      <CategoryCreate isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      {selectedIndex !== null && (
        <CategoryEdit
          isOpen={isEditOpen}
          onClose={() =>{
            setIsEditOpen(false);
            setSelectedIndex(null)
          }}
          category={localCategories[selectedIndex]}
        />
      )}
      <Confirm
        message="Are you Sure you want to remove the Category"
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmRemove}
      />
      <RecycleModal
        isOpen={isRecycleBinOpen}
        onClose={() => setIsRecycleBinOpen(false)}
        recycleType="category"
      />

      </div>
    </div>
  )
}

export default page