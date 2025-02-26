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
  FiDownload,
} from "react-icons/fi";
import { MdQrCode2 } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isFoodMenuOpen, setIsFoodMenuOpen] = useState(false);
  const [isIngredientsMenuOpen, setIsIngredientsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine if link is active
  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(href);
  };

  const isFoodActive = isActiveLink("/inventory/food");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  // Logout handler with SweetAlert2
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

  // Show limited menu items for these roles only
  const limitedRoles = ["Kitchen", "Waiter", "Cashier"];
  const showLimitedMenu = userRole && limitedRoles.includes(userRole);

  return (
    <div
      className={`h-full bg-black shadow-lg transition-[width] duration-300 ${
        isExpanded ? "w-[18rem]" : "w-14"
      } fixed top-0 left-0 flex flex-col`}
    >
      {/* Collapse/Expand Button + Logo */}
      <div className="flex items-center justify-between p-4">
        {isExpanded && (
          <div className="flex flex-col">
            <img src="/assets/vertical.png" alt="Logo" className="h-10 w-24" />
            <p className="mt-2 text-white text-lg font-semibold">{localStorage.getItem("Name")}</p>
          </div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-customGold text-xl focus:outline-none"
          aria-label={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <ul className="p-4 space-y-4">
          <li>
            <a
              href="/order"
              data-tooltip-id="sidebar-tooltip"
              data-tooltip-content="Manage Orders Here"
              className={`flex items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                isActiveLink("/order")
                  ? "bg-gray-800"
                  : "text-customGold hover:bg-gray-800"
              }`}
            >
              <FiClipboard className="text-xl text-customGold" />
              {isExpanded && (
                <span className="text-lg text-white">Order Management</span>
              )}
            </a>
          </li>

          {/* If not a limited role, show additional menu items */}
          {!showLimitedMenu && (
            <>
              {/* Food Inventory Dropdown */}
              <li>
                <button
                  onClick={() => setIsFoodMenuOpen(!isFoodMenuOpen)}
                  data-tooltip-id="sidebar-tooltip"
                  data-tooltip-content="Manage External and Internal Food Items"
                  className={`w-full flex justify-between items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                    isFoodActive
                      ? "bg-gray-800"
                      : "text-customGold hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FiBox className="text-xl text-customGold" />
                    {isExpanded && (
                      <span className="text-lg text-white">Food Inventory</span>
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
                        data-tooltip-id="sidebar-tooltip"
                        data-tooltip-content="Manage Internal Food Items"
                        className={`block p-1 rounded text-base transition-colors duration-200 ${
                          isActiveLink("/inventory/food/internal")
                            ? "bg-gray-800"
                            : "text-customGold hover:bg-gray-800"
                        }`}
                      >
                        Internal
                      </a>
                    </li>
                    <li>
                      <a
                        href="/inventory/food/external"
                        data-tooltip-id="sidebar-tooltip"
                        data-tooltip-content="Manage External Food Items"
                        className={`block p-1 rounded text-base transition-colors duration-200 ${
                          isActiveLink("/inventory/food/external")
                            ? "bg-gray-800"
                            : "text-customGold hover:bg-gray-800"
                        }`}
                      >
                        External
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              {/* Portion Management */}
              <li>
                <a
                  href="/portion"
                  data-tooltip-id="sidebar-tooltip"
                  data-tooltip-content="Manage Portions Here"
                  className={`flex items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                    isActiveLink("/portion")
                      ? "bg-gray-800"
                      : "text-customGold hover:bg-gray-800"
                  }`}
                >
                  <FiLayers className="text-customGold text-xl" />
                  {isExpanded && (
                    <span className="text-lg text-white">
                      Portion Management
                    </span>
                  )}
                </a>
              </li>

              {/* Ingredients Inventory Dropdown */}
              <li>
                <button
                  onClick={() => setIsIngredientsMenuOpen(!isIngredientsMenuOpen)}
                  data-tooltip-id="sidebar-tooltip"
                  data-tooltip-content="Manage Ingredients Here"
                  className={`w-full flex justify-between items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                    isActiveLink("/inventory/ingredients") ||
                    isActiveLink("/inventory/ingredients/categories")
                      ? "bg-gray-800"
                      : "text-customGold hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FiBookOpen className="text-xl text-customGold" />
                    {isExpanded && (
                      <span className="text-lg text-white">
                        Ingredients Inventory
                      </span>
                    )}
                  </div>
                  {isExpanded &&
                    (isIngredientsMenuOpen ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    ))}
                </button>
                {isExpanded && isIngredientsMenuOpen && (
                  <ul className="pl-8 mt-1 space-y-1">
                    <li>
                      <a
                        href="/inventory/ingredients/categories"
                        className={`block p-1 rounded text-base transition-colors duration-200 ${
                          isActiveLink("/inventory/ingredients/categories")
                            ? "bg-gray-800"
                            : "text-customGold hover:bg-gray-800"
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
                            ? "bg-gray-800"
                            : "text-customGold hover:bg-gray-800"
                        }`}
                      >
                        Ingredients
                      </a>
                    </li>
                    <li>
                      <a
                        href="/inventory/ingredients/stockIn"
                        className={`block p-1 rounded text-base transition-colors duration-200 ${
                          isActiveLink("/inventory/ingredients/stockin")
                            ? "bg-gray-800"
                            : "text-customGold hover:bg-gray-800"
                        }`}
                      >
                        Transaction Records
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              {/* Menu Management */}
              <li>
                <a
                  href="/menutype"
                  data-tooltip-id="sidebar-tooltip"
                  data-tooltip-content="Manage Menus Here"
                  className={`flex items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                    isActiveLink("/menuType")
                      ? "bg-gray-800"
                      : "text-customGold hover:bg-gray-800"
                  }`}
                >
                  <FiGrid className="text-customGold text-xl" />
                  {isExpanded && (
                    <span className="text-lg text-white">Menu Management</span>
                  )}
                </a>
              </li>

              {/* Employee Management */}
              <li>
                <a
                  href="/employee"
                  data-tooltip-id="sidebar-tooltip"
                  data-tooltip-content="Manage Employees Here"
                  className={`flex items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                    isActiveLink("/employee")
                      ? "bg-gray-800"
                      : "text-customGold hover:bg-gray-800"
                  }`}
                >
                  <FiUser className="text-customGold text-xl" />
                  {isExpanded && (
                    <span className="text-lg text-white">
                      Employee Management
                    </span>
                  )}
                </a>
              </li>

              {/* Supplier Management */}
              <li>
                <a
                  href="/supplier"
                  data-tooltip-id="sidebar-tooltip"
                  data-tooltip-content="Manage Suppliers"
                  className={`flex items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                    isActiveLink("/supplier")
                      ? "bg-gray-800"
                      : "text-customGold hover:bg-gray-800"
                  }`}
                >
                  <FiUsers className="text-customGold text-xl" />
                  {isExpanded && (
                    <span className="text-lg text-white">
                      Supplier Management
                    </span>
                  )}
                </a>
              </li>

              {/* Generate QR */}
              <li>
                <a
                  href="/qrgenerate"
                  data-tooltip-id="sidebar-tooltip"
                  data-tooltip-content="Generate QR Code"
                  className={`flex items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                    isActiveLink("/qrgenerate")
                      ? "bg-gray-800"
                      : "text-customGold hover:bg-gray-800"
                  }`}
                >
                  <MdQrCode2 className="text-customGold text-xl" />
                  {isExpanded && (
                    <span className="text-lg text-white">Generate QR</span>
                  )}
                </a>
              </li>
              <li>
                <a 
                  href="/import-pos"
                  data-tooltip-id="sidebar-tooltip"
                  data-tooltip-content="Click to Import Data"
                  className={`flex items-center p-1 rounded-md text-xl transition-colors duration-200 space-x-2 ${
                    isActiveLink("/import-from-pos")
                      ? "bg-gray-800"
                      : "text-customGold hover:bg-gray-800"
                  }`}
                >
                  <FiDownload className="text-customGold text-xl"/>
                  {isExpanded && (
                    <span className="text-lg text-white">Import Data</span>
                  )}
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
          title="Click to Log out"
          className="flex items-center space-x-2 w-full bg-red-500 text-white font-bold py-2 px-2 rounded-md hover:bg-red-600"
        >
          <FiLogOut className="text-2xl" />
          {isExpanded && <span>Log Out</span>}
        </button>
      </div>
      <Tooltip id="sidebar-tooltip" place="bottom"/>
    </div>
  );
};

export default Sidebar;
