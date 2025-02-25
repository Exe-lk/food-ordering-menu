"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import Button from "@/components/Button";
import Sidebar from "@/components/Sidebar";
import Heading from "@/components/Headings/Heading";
import MenuCard from "@/components/MenuManagement/MenuCard";
import MenuCreate from "@/components/PopUpModels/MenuCreate";
import Confirm from "@/components/PopUpModels/Confirm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchMenus, removeMenu } from "@/redux/features/menuSlice";
import MenuEdit from "@/components/PopUpModels/EditPopUps/MenuEdit";
import RecycleBinButton from "@/components/RecycleBin";
import RecycleModal from "@/components/RecycleModal";
import Swal from "sweetalert2";
import ProgressBar from "@/components/ProgressBar";

const Page = () => {
  const dispatch = useDispatch<any>();
  const { menus, loading, fetched } = useSelector((state: RootState) => state.menuType);
  const [localMenus, setLocalMenus] = useState(menus);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("All")

  const [isPageLoading, setIsPageLoading] = useState(true);

  // Fetch menus if not already fetched
  useEffect(() => {
    if (!fetched) {
      dispatch(fetchMenus());
    }
  }, [fetched, dispatch]);

  // When menus are loaded, update local state and disable the loader
  useEffect(() => {
    if (menus.length > 0) {
      setLocalMenus(menus);
      setIsPageLoading(false);
    }
  }, [menus]);

  const filteredMenus = localMenus.filter((menu) => {
    const matchName = menu.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType =
      selectedType === "All" ||
      (menu.menu_type && menu.menu_type.toLowerCase() === selectedType.toLowerCase());
    return matchName && matchType;
  });

  const handleEdit = (index: number) => {
    setSelectedMenuIndex(index);
    setIsEditOpen(true);
  };

  const handleRemove = (index: number) => {
    setSelectedMenuIndex(index);
    setIsConfirmOpen(true);
  };

  const confirmRemove = async () => {
    if (selectedMenuIndex !== null) {
      try {
        await dispatch(removeMenu({ id: localMenus[selectedMenuIndex].id })).unwrap();
        dispatch(fetchMenus());
        setIsConfirmOpen(false);
        setSelectedMenuIndex(null);
      } catch (error:any) {
        console.error("Error Removing Menu:", error);
        Swal.fire({
          title:"Error",
          text:error,
          icon:"error",
          confirmButtonText: "Try Again"
        })
      }
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
       <ProgressBar/>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar/>
      <div className="p-4 min-h-screen bg-beige ml-14 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-customGold">Menu Management</h1>
        <SearchBar placeholder="Search Menu" onSearch={setSearchQuery} />
      </div>
      
      <div className="flex items-center justify-between mt-4 mb-3">
          <Button label="Create Menu" variant="primary" onClick={() => setIsPopupOpen(true)} />
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedType("All")}
              className={`px-4 py-2 border rounded ${
                selectedType === "All" ? "bg-customGold text-white" : "bg-white text-black"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType("Food")}
              className={`px-4 py-2 border rounded ${
                selectedType === "Food" ? "bg-customGold text-white" : "bg-white text-black"
              }`}
            >
              Food
            </button>
            <button
              onClick={() => setSelectedType("Bar")}
              className={`px-4 py-2 border rounded ${
                selectedType === "Bar" ? "bg-customGold text-white" : "bg-white text-black"
              }`}
            >
              Bar
            </button>
          </div>
        </div>
      

      <Heading titles={["Menu Name", "Type"]} />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-customGold rounded-full animate-spin"></div>
        </div>
      ) : filteredMenus.length > 0 ? (
        <MenuCard menus={filteredMenus} onEdit={handleEdit} onRemove={handleRemove} />
      ) : (
        <p className="text-black">
          {searchQuery ? "No menus found." : "No menus available."}
        </p>
      )}

      <RecycleBinButton onClick={() => setIsRecycleBinOpen(true)} />
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

     <RecycleModal isOpen={isRecycleBinOpen} onClose={() => setIsRecycleBinOpen(false)} recycleType="menu"/>
    </div>
    </div>
  );
};

export default Page;
