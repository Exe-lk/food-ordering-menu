// MenuEdit.tsx
"use client";
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateMenu, fetchMenus, resetFetched, Menu } from "@/redux/features/menuSlice";

interface MenuEditProps {
  isOpen: boolean;
  onClose: () => void;
  menu: Menu;
}

const MenuEdit = ({ isOpen, onClose, menu }: MenuEditProps) => {
  const dispatch = useDispatch<any>();
  const { loading } = useSelector((state: RootState) => state.menuType);
  const [menuName, setMenuName] = useState(menu.name);
  const [menuType, setMenuType] = useState(menu.menu_type || "Food");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(menu.imageUrl);

  // Update fields when a new menu is passed in.
  useEffect(() => {
    if (menu) {
      setMenuName(menu.name);
      setMenuType(menu.menu_type || "Food");
      setPreviewUrl(menu.imageUrl);
      setImage(null);
    }
  }, [menu]);

  const handleUpdate = async () => {
    // Only update if any field has changed.
    if (menuName === menu.name && !image && menuType === (menu.menu_type || "Food")) return;

    try {
      await dispatch(
        updateMenu({ 
          id: menu.id, 
          updatedMenuName: menuName, 
          image, 
          menu_type: menuType 
        })
      ).unwrap();
      dispatch(fetchMenus());
      dispatch(resetFetched());
      onClose();
    } catch (error) {
      console.error("Error updating menu:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      // Generate a preview URL from the file.
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-85">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 text-2xl"
        >
          <FiX />
        </button>
        <h2 className="text-xl font-semibold text-center mb-4 text-customGold">
          Edit Menu
        </h2>
        <div className="mb-3">
          <label className="block text-gray-700 font-medium">Menu Name</label>
          <input
            type="text"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            className="w-full border rounded-md p-2 text-black"
            placeholder="Ex: Italian"
          />
        </div>
        {/* New dropdown for menu type */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium">Menu Type</label>
          <select
            value={menuType}
            onChange={(e) => setMenuType(e.target.value)}
            className="w-full border rounded-md p-2 text-black"
          >
            <option value="Bar">Bar</option>
            <option value="Food">Food</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 font-medium">
            Upload New Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-md p-2 text-black"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-2 h-auto w-full object-contain rounded-md"
            />
          )}
        </div>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-customGold text-white py-2 rounded-md hover:bg-orange-500 cursor-pointer"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default MenuEdit;
