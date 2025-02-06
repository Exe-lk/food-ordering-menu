"use client";
import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import SearchBar from "@/components/SearchBar";
import Button from "@/components/Button";
import Sidebar from "@/components/Sidebar";
import Heading from "@/components/Headings/Heading";
import MenuCard from "@/components/MenuManagement/MenuCard";
import MenuCreate from "@/components/PopUpModels/MenuCreate";
import Confirm from "@/components/PopUpModels/Confirm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchMenus } from "@/redux/features/menuSlice";
import MenuEdit from "@/components/PopUpModels/EditPopUps/MenuEdit";

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch<any>();
  const { menus, loading, fetched } = useSelector((state: RootState) => state.menuType);
  const [localMenus, setLocalMenus] = useState(menus);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Fetch menus only if they haven't been fetched before
  useEffect(() => {
    if (!fetched) {
      dispatch(fetchMenus());
    }
  }, [fetched, dispatch]);

  // Update local state only when menus actually change
  useEffect(() => {
    if (menus.length > 0) {
      setLocalMenus(menus);
    }
  }, [menus]);

  const handleEdit = (index: number) => {
    setSelectedMenuIndex(index);
    setIsEditOpen(true);
  };

  const handleRemove = (index: number) => {

  };

  const confirmRemove = () => {

  };

  return (
    <div className="p-4 min-h-screen bg-beige">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setIsSidebarOpen(true)} className="text-2xl text-customblue">
          <FiMenu />
        </button>
        <h1 className="text-3xl font-bold text-customblue">Menu Management</h1>
        <SearchBar placeholder="Search Menu" onSearch={setSearchQuery} />
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex space-x-4 mt-4 items-start justify-start w-full mb-3">
        <Button label="Create Menu" variant="primary" onClick={() => setIsPopupOpen(true)} />
      </div>

      <Heading titles={["Menu Name"]} />

      {loading ? (
        <p>Loading...</p>
      ) : localMenus.length > 0 ? (
        <MenuCard menus={localMenus} onEdit={handleEdit} onRemove={handleRemove} />
      ) : (
        <p className="text-black">No menus available</p>
      )}

      <MenuCreate isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      {selectedMenuIndex !== null && (
        <MenuEdit
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedMenuIndex(null);
          }}
          menu={localMenus[selectedMenuIndex]}
        />
      )}
      <Confirm
        message="Are you sure you want to remove the menu?"
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmRemove}
      />
    </div>
  );
};

export default Page;
