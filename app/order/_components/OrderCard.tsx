"use client";
import { Menu } from "@headlessui/react";
import { useState } from "react";

interface OrderCardProps {
  name: string;
  table: string;
  items: { name: string; size: string; quantity: number }[];
  total: string;
  status: "Ready" | "Cooking" | "Served" | "New Order"
}

const OrderCard: React.FC<OrderCardProps> = ({ name, table, items, total, status }) => {
  const [currentStatus, setCurrentStatus] = useState(status);

  const statusColors = {
    Ready: "bg-blue-100 text-blue-700",
    Cooking: "bg-yellow-100 text-yellow-700",
    Served: "bg-green-100 text-green-700",
    "New Order": "bg-orange-100 text-orange-700",
  };

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus as typeof status);
  };

  return (
    <div className="border rounded-lg shadow-md bg-white p-4 w-80">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-black">{name}</h3>
        </div>
        <Menu as="div" className="relative">
          <Menu.Button
            className={`text-sm font-semibold px-3 py-1 rounded-full ${statusColors[currentStatus]}`}
          >
            {currentStatus}
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-1 w-36 bg-white border rounded-md shadow-lg">
            {["Ready", "Cooking", "Served", "New Order"].map((statusOption) => (
              <Menu.Item key={statusOption}>
                {({ active }) => (
                  <button
                    onClick={() => handleStatusChange(statusOption)}
                    className={`block w-full px-4 py-2 text-sm text-left text-black ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    {statusOption}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
      </div>

      {/* Table Information */}
      <p className="text-sm text-gray-500 mt-1">Table {table}</p>
      <hr className="my-3" />

      {/* Items Section */}
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
        <p>{items.length} Items</p>
        <p className="text-lg font-bold">{total}</p>
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
