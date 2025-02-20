"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/Button";
import PortionCard from "@/components/Inventory/PortionCard";
import Confirm from "@/components/PopUpModels/Confirm";
import PortionCreate from "@/components/PopUpModels/PortionCreate";
import Heading from "@/components/Headings/Heading";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchPortions, removePortion } from "@/redux/features/portionSlice";
import PortionEdit from "@/components/PopUpModels/EditPopUps/PortionEdit";
import RecycleBinButton from "@/components/RecycleBin";
import PortionRecycleBin from "@/components/RecycleBins/PortionRecycleBin";
import RecycleModal from "@/components/RecycleModal";

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch<any>();
  const { portions, loading, fetched, error } = useSelector((state: RootState) => state.portionType);
  const [localPortions, setLocalPortions] = useState(portions);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);

  useEffect(() => {
    if (!fetched) {
      dispatch(fetchPortions());
    }
  }, [fetched, dispatch]);

  useEffect(() => {
    if (portions.length > 0) {
      setLocalPortions(portions);
    }
  }, [portions]);

  const handleEdit = (index: number) => {
    setSelectedIndex(index)
    setIsEditOpen(true);
  };

  const handleRemove = (index: number) => {
    setSelectedIndex(index);
    setIsConfirmOpen(true);
  };

  const confirmRemove = async () => {
    if(selectedIndex !== null){
      try {
        await dispatch(removePortion({id:localPortions[selectedIndex].id})).unwrap();
        dispatch(fetchPortions());
        setIsConfirmOpen(false);
        setSelectedIndex(null)

      } catch (error) {
        console.error("Error Removing Portion:", error);
      }
    }
  };

  return (
    <div className="flex">
      <Sidebar/>
      <div className="p-4 min-h-screen bg-beige w-full ml-14">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-customGold">Portion Management</h1>
        <SearchBar placeholder="Search Portions" onSearch={setSearchQuery} />
      </div>
      <div className="flex space-x-4 mt-4 items-start justify-start w-full mb-3">
        <Button label="Create Portion" variant="primary" onClick={() => setIsPopupOpen(true)} />
      </div>
      <Heading titles={["Portion Name", "Served Number"]} />

      {loading ? (
        <p>Loading...</p>
      ) : localPortions.length > 0 ? (
        <PortionCard portions={localPortions} onEdit={handleEdit} onRemove={handleRemove} />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-black">No Portions Available</p>
      )}
      <RecycleBinButton  onClick={() => setIsRecycleBinOpen(true)}/>

      <PortionCreate isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      {selectedIndex !== null &&(
        <PortionEdit 
        isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false)
          setSelectedIndex(null)
        }}
        portion={localPortions[selectedIndex]}
        />
      )}
      <Confirm
        message="Are you sure you want to remove the portion?"
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmRemove}
      />
      <RecycleModal isOpen={isRecycleBinOpen} onClose={() => setIsRecycleBinOpen(false)} recycleType="portion"/>
    </div>
    </div>
  );
};

export default Page;
