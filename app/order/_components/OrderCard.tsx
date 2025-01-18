"use client";
import { useState, useRef, useEffect } from "react";

interface OrderCardProps {
  name: string;
  table: string;
  items: { name: string; size: string; quantity: number }[];
  total: string;
  status: "Ready" | "Cooking" | "Served" | "New Order";
}

const OrderCard: React.FC<OrderCardProps> = ({ name, table, items, total, status }) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statusColors = {
    Ready: "bg-blue-100 text-blue-700",
    Cooking: "bg-yellow-100 text-yellow-700",
    Served: "bg-green-100 text-green-700",
    "New Order": "bg-orange-100 text-orange-700",
  };

  const handleStatusChange = (newStatus: typeof status) => {
    setCurrentStatus(newStatus);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="border rounded-lg shadow-md bg-white p-4 w-80">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-black">{name}</h3>

        {/* Custom Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`text-sm font-semibold px-3 py-1 rounded-full focus:outline-none ${statusColors[currentStatus]}`}
          >
            {currentStatus}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white border rounded-md shadow-lg z-10">
              {["Ready", "Cooking", "Served", "New Order"].map((statusOption) => (
                <button
                  key={statusOption}
                  onClick={() => handleStatusChange(statusOption as typeof status)}
                  className={`block w-full px-4 py-2 text-sm text-left text-black hover:bg-gray-100 ${
                    currentStatus === statusOption ? "font-bold" : ""
                  }`}
                >
                  {statusOption}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Information */}
      <p className="text-sm text-gray-500 mt-1">Table {table}</p>
      <hr className="my-3" />

      {/* Items Section */}
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
        <p>{items.length} Items</p>
        <p>{total}</p>
      </div>

      <ul className="text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between">
            <div className="flex gap-2">
              <span>{item.name}</span>
              <span className="text-gray-400">{item.size}</span>
            </div>
            <span>x{item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderCard;
