"use client";
import React, { useState, useEffect } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiClipboard,
  FiBox,
  FiBookOpen,
  FiGrid,
  FiUser,
  FiLogOut,
  FiLayers,
  FiUsers,
} from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isFoodMenuOpen, setIsFoodMenuOpen] = useState(false);
  const [isIngredientsMenuOpen, setIsIngredientsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(href);
  };

  const isFoodActive = isActiveLink("/inventory/food");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

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
      localStorage.removeItem("Name");
      localStorage.removeItem("empId");
      localStorage.removeItem("role");
      router.push("/login");
    }
  };

  const limitedRoles = ["Kitchen", "Waiter", "Cashier"];
  const showLimitedMenu = userRole && limitedRoles.includes(userRole);

  return (
    <div
      className={`h-full bg-white shadow-lg transition-[width] duration-300 ${
        isExpanded ? "w-[18rem]" : "w-14"
      } fixed top-0 left-0 flex flex-col`}
    >
      {/* Collapse/Expand Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-customblue text-xl focus:outline-none"
          aria-label={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-4">
          <li>
            <a
              href="/order"
              className={`flex items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                isActiveLink("/order")
                  ? "bg-gray-300"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
            >
              <FiClipboard className="text-xl text-customblue" />
              {isExpanded && (
                <span className="text-lg text-gray-800">
                  Order Management
                </span>
              )}
            </a>
          </li>

          {!showLimitedMenu && (
            <>
              <li>
                <button
                  onClick={() => setIsFoodMenuOpen(!isFoodMenuOpen)}
                  className={`w-full flex justify-between items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                    isFoodActive
                      ? "bg-gray-300"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FiBox className="text-xl text-customblue" />
                    {isExpanded && (
                      <span className="text-lg text-gray-700">
                        Food Inventory
                      </span>
                    )}
                  </div>
                  {isExpanded &&
                    (isFoodMenuOpen ? <FiChevronUp /> : <FiChevronDown />)}
                </button>
                {isExpanded && isFoodMenuOpen && (
                  <ul className="pl-8 mt-1 space-y-1">
                    <li>
                      <a
                        href="/inventory/food/internal"
                        className={`block p-1 rounded text-base transition-colors duration-200 ${
                          isActiveLink("/inventory/food/internal")
                            ? "bg-gray-300"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Internal
                      </a>
                    </li>
                    <li>
                      <a
                        href="/inventory/food/external"
                        className={`block p-1 rounded text-base transition-colors duration-200 ${
                          isActiveLink("/inventory/food/external")
                            ? "bg-gray-300"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        External
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <a
                  href="/portion"
                  className={`flex items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                    isActiveLink("/portion")
                      ? "bg-gray-300"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <FiLayers className="text-customblue text-xl" />
                  {isExpanded && (
                    <span className="text-lg text-gray-700">
                      Portion Management
                    </span>
                  )}
                </a>
              </li>

              {/* Ingredients Management Dropdown */}
              <li>
                <button
                  onClick={() =>
                    setIsIngredientsMenuOpen(!isIngredientsMenuOpen)
                  }
                  className={`w-full flex justify-between items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                    isActiveLink("/inventory/ingredients") ||
                    isActiveLink("/inventory/ingredients/categories")
                      ? "bg-gray-300"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FiBookOpen className="text-xl text-customblue" />
                    {isExpanded && (
                      <span className="text-lg text-gray-700">
                        Ingredients Inventory
                      </span>
                    )}
                  </div>
                  {isExpanded &&
                    (isIngredientsMenuOpen ? <FiChevronUp /> : <FiChevronDown />)}
                </button>
                {isExpanded && isIngredientsMenuOpen && (
                  <ul className="pl-8 mt-1 space-y-1">
                    <li>
                      <a
                        href="/inventory/ingredients/categories"
                        className={`block p-1 rounded text-base transition-colors duration-200 ${
                          isActiveLink("/inventory/ingredients/categories")
                            ? "bg-gray-100 text-black"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Categories
                      </a>
                    </li>
                    <li>
                      <a
                        href="/inventory/ingredients"
                        className={`block p-1 rounded text-base transition-colors duration-200 ${
                          isActiveLink("/inventory/ingredients")
                            ? "bg-gray-100 text-black"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Ingredients
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <a
                  href="/menutype"
                  className={`flex items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                    isActiveLink("/menuType")
                      ? "bg-gray-300"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <FiGrid className="text-customblue text-xl" />
                  {isExpanded && (
                    <span className="text-lg text-gray-700">
                      Menu Management
                    </span>
                  )}
                </a>
              </li>

              <li>
                <a
                  href="/employee"
                  className={`flex items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                    isActiveLink("/employee")
                      ? "bg-gray-300"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <FiUser className="text-customblue text-xl" />
                  {isExpanded && (
                    <span className="text-lg text-gray-700">
                      Employee Management
                    </span>
                  )}
                </a>
              </li>

              <li>
                <a
                  href="/supplier"
                  className={`flex items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                    isActiveLink("/supplier")
                      ? "bg-gray-300"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <FiUsers className="text-customblue text-xl" />
                  {isExpanded && (
                    <span className="text-lg text-gray-700">
                      Supplier Management
                    </span>
                  )}
                </a>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full bg-red-500 text-white font-bold py-2 px-2 rounded-md hover:bg-red-600"
        >
          <FiLogOut className="text-2xl" />
          {isExpanded && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
