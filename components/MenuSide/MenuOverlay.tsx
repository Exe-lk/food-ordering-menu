"use client";

import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchMenus, resetFetched, Menu, setSelectedMenu } from "@/redux/features/menuSlice";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          dispatch(resetFetched());
          const data = await dispatch(fetchMenus()).unwrap();
          setMenus(data);
        } catch (error) {
          console.error("Error fetching menus:", error);
        }
      };

      fetchData();
    }
  }, [dispatch, isOpen]);

  if (!isOpen) return null;

  const handleMenuClick = (menu: Menu) => {
    // Update the Redux state with the selected menu
    dispatch(setSelectedMenu(menu.name));
    onClose();
    router.push(`/menu/home/${menu.menu_type?.toLowerCase()}/${menu.name}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
      <div className="bg-white w-full h-3/4 rounded-t-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-black">Menus</h2>
          <button className="text-black" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>
        <ul className="space-y-4">
          {menus.map((menu, index) => (
            <li key={index}>
              <button
                onClick={() => handleMenuClick(menu)}
                className="text-lg font-medium text-gray-700"
              >
                {menu.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuOverlay;
