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

  // Fetch menus if not already fetched
  useEffect(() => {
    if (!fetched) {
      dispatch(fetchMenus());
    }
  }, [fetched, dispatch]);

  useEffect(() => {
    if (menus.length > 0) {
      setLocalMenus(menus);
    }
  }, [menus]);

  const filteredMenus = localMenus.filter((menu) =>
    menu.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="flex">
      <Sidebar/>
      <div className="p-4 min-h-screen bg-beige ml-14 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-customGold">Menu Management</h1>
        <SearchBar placeholder="Search Menu" onSearch={setSearchQuery} />
      </div>
      <div className="flex space-x-4 mt-4 items-start justify-start w-full mb-3">
        <Button label="Create Menu" variant="primary" onClick={() => setIsPopupOpen(true)} />
      </div>

      <Heading titles={["Menu Name"]} />

      {loading ? (
        <p>Loading...</p>
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
