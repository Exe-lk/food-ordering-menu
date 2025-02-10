"use client";
import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SideBarProps) => {
  const router = useRouter();
  const [isFoodMenuOpen, setIsFoodMenuOpen] = useState(false);
  const [isIngredientsMenuOpen, setIsIngredientsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Get the user role from localStorage once the component mounts
  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  // Updated async logout handler using SweetAlert2 confirmation
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Confirm Logout",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      // Clear user data and navigate to /login
      localStorage.removeItem("Name");
      localStorage.removeItem("empId");
      localStorage.removeItem("role");
      router.push("/login");
    }
  };

  if (!isOpen) return null;
  const limitedRoles = ["Kitchen", "Waiter", "Cashier"];
  const showLimitedMenu = userRole && limitedRoles.includes(userRole);

  return (
    <div className="fixed top-0 left-0 w-1/4 h-full bg-white shadow-lg z-50 flex flex-col">
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-black text-2xl">
          <FiX />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-4">
          {/* Order Management tab is always visible */}
          <li>
            <a href="/order" className="block text-xl text-gray-800">
              Order Management
            </a>
          </li>

          {/* If the user is not one of the limited roles (e.g. Admin), display the rest of the menu */}
          {!showLimitedMenu && (
            <>
              <li>
                <button
                  onClick={() => setIsFoodMenuOpen(!isFoodMenuOpen)}
                  className="w-full flex justify-between items-center text-xl text-gray-800"
                >
                  Food Inventory
                  {isFoodMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {isFoodMenuOpen && (
                  <ul className="pl-4 mt-2 space-y-4">
                    <li>
                      <a
                        href="/inventory/food/internal"
                        className="block text-gray-800 text-lg"
                      >
                        Internal
                      </a>
                    </li>
                    <li>
                      <a
                        href="/inventory/food/external"
                        className="block text-gray-800 text-lg"
                      >
                        External
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <a href="/portion" className="block text-gray-800 text-xl">
                  Portion Management
                </a>
              </li>
              <li>
                <a
                  href="/inventory/ingredients"
                  className="block text-gray-800 text-xl"
                >
                  Ingredients Inventory
                </a>
              </li>
              <li>
                <a href="/menutype" className="block text-gray-800 text-xl">
                  Menu Management
                </a>
              </li>
              <li>
                <a href="/employee" className="block text-gray-800 text-xl">
                  Employee Management
                </a>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white font-bold py-2 rounded-md"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
