"use client";
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/Button";
import portionOptions from "@/data/portionst+";
import TableHeading from "@/components/TableHeading";
import PortionCard from "@/components/Inventory/PortionCard";
import Confirm from "@/components/PopUpModels/Confirm";

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [portions, setPortions] = useState(portionOptions); // State to manage portion list

  // Edit portion
  const handleEdit = (index: number) => {
    console.log("Editing portion at index:", index);
    // Implement edit logic
  };

  // Open confirm modal before removing
  const handleRemove = (index: number) => {
    console.log("Preparing to remove portion at index:", index);
    setSelectedProductId(index);
    setIsConfirmOpen(true);
  };

  // Confirm and remove portion from the list
  const confirmRemove = () => {
    if (selectedProductId !== null) {
      setPortions((prevPortions) => prevPortions.filter((_, i) => i !== selectedProductId));
      console.log("Removed portion at index:", selectedProductId);
    }
    setIsConfirmOpen(false);
    setSelectedProductId(null);
  };

  return (
    <div className="p-4 min-h-screen bg-beige">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setIsSidebarOpen(true)} className="text-2xl text-customblue">
          <FiMenu />
        </button>
        <h1 className="text-3xl font-bold text-black">Portion Management</h1>
        <SearchBar placeholder="Search Portions" onSearch={setSearchQuery} />
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Create Portion Button */}
      <div className="flex space-x-4 mt-4 items-start justify-start w-full mb-3">
        <Button label="Create Portion" variant="primary" />
      </div>

      {/* Table Heading */}
      <TableHeading headings={["Name", "Served Number", "Actions"]} />

      {/* Portion Cards - Display below TableHeading */}
      <PortionCard portions={portions} onEdit={handleEdit} onRemove={handleRemove} />

      {/* Confirm Delete Popup */}
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
