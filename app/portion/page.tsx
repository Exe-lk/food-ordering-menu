"use client";
import React, { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/Button";
import TableHeading from "@/components/Headings/TableHeading";
import PortionCard from "@/components/Inventory/PortionCard";
import Confirm from "@/components/PopUpModels/Confirm";
import PortionCreate from "@/components/PopUpModels/PortionCreate";
import Heading from "@/components/Headings/Heading";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchPortions } from "@/redux/features/portionSlice";

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch<any>();
  const { portions, loading, fetched, error } = useSelector((state: RootState) => state.portionType);
  const [localPotions, setLocalPotions] = useState(portions);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  useEffect(() =>{
    if(!fetched){
      dispatch(fetchPortions());
    }
  }, [fetched, dispatch]);
  useEffect(() =>{
    if(portions.length > 0){
      setLocalPotions(portions);
    }
  },[portions]);
  const handleEdit = (index: number) => {
    console.log("Editing portion at index:", index);
  };
  const handleRemove = (index: number) => {
    console.log("Preparing to remove portion at index:", index);
    setSelectedProductId(index);
    setIsConfirmOpen(true);
  };
  const confirmRemove = () => {
    setIsConfirmOpen(false);
    setSelectedProductId(null);
  };

  return (
    <div className="p-4 min-h-screen bg-beige">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setIsSidebarOpen(true)} className="text-2xl text-customblue">
          <FiMenu />
        </button>
        <h1 className="text-3xl font-bold text-customblue">Portion Management</h1>
        <SearchBar placeholder="Search Portions" onSearch={setSearchQuery} />
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex space-x-4 mt-4 items-start justify-start w-full mb-3">
        <Button label="Create Portion" variant="primary" onClick={() => setIsPopupOpen(true)} />
      </div>
      <Heading titles={["Portion Name", "Served Number"]}/>

      {loading ? (
        <p>Loading...</p>
      ) : localPotions.length > 0 ? (
        <PortionCard portions={localPotions} onEdit={handleEdit} onRemove={handleRemove} />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-black">No Portions Available</p>
      )}

      <PortionCreate isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}/>
      <Confirm
        message="Are you sure you want to remove the portion?"
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmRemove}
      />
    </div>
  );
};

export default Page;
