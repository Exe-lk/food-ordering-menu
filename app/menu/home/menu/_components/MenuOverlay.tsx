"use client";

import React from "react";
import { FiX } from "react-icons/fi";
import Link from "next/link";
import menuData from "@/data/menus";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose }) => {
  const menus = menuData.map((menu) => menu.name);

  if (!isOpen) return null;

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
              <Link
                href={`/menu/home/menu/${menu}`}
                onClick={onClose}
                className="text-lg font-medium text-gray-700"
              >
                {menu}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuOverlay;
