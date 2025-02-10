"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Menu } from "@headlessui/react";
import { GiMeal } from "react-icons/gi";
import { FiChevronDown } from "react-icons/fi";
import {
  FaConciergeBell,
  FaClock,
  FaCheckCircle,
  FaUtensils,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateOrderStatus } from "@/redux/features/orderSlice";

interface OrderItem {
  name: string;
  size?: string;  
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  phoneNumber: string;
  tableNumber: string;
  status: string;
  created_at: string;
}

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [status, setStatus] = useState(order.status);
  const [userRole, setUserRole] = useState<string | null>(null);
  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    dispatch(updateOrderStatus({ id: order.id, status: newStatus }));
  };
  const allowedOptions = useMemo(() => {
    if (!userRole) return [];
    if (userRole === "Admin") {
      return [
        { value: "Pending", icon: FaClock, color: "text-[#D00000]" },
        { value: "Cooking", icon: FaConciergeBell, color: "text-[#FFBA08]" },
        { value: "Ready", icon: FaUtensils, color: "text-blue-500" },
        { value: "Served", icon: GiMeal, color: "text-[#10e060]" },
        { value: "Billed", icon: FaMoneyBillWave, color: "text-indigo-500" },
        { value: "Completed", icon: FaCheckCircle, color: "text-green-500" },
      ];
    }
    if (userRole === "Kitchen") {
      return [
        { value: "Pending", icon: FaClock, color: "text-[#D00000]" },
        { value: "Cooking", icon: FaConciergeBell, color: "text-[#FFBA08]" },
        { value: "Ready", icon: FaUtensils, color: "text-blue-500" },
      ];
    } else if (userRole === "Waiter") {
      return [
        { value: "Ready", icon: FaUtensils, color: "text-blue-500" },
        { value: "Served", icon: FaCheckCircle, color: "text-green-500" },
      ];
    } else if (userRole === "Cashier") {
      return [
        { value: "Served", icon: FaCheckCircle, color: "text-green-500" },
        { value: "Billed", icon: FaMoneyBillWave, color: "text-indigo-500" },
        { value: "Completed", icon: FaCheckCircle, color: "text-green-500" },
      ];
    } else {
      return [];
    }
  }, [userRole]);
  const defaultStatusMapping: Record<
    string,
    { icon: React.ComponentType<{ className?: string }>; color: string }
  > = {
    Pending: { icon: FaClock, color: "text-[#D00000]" },
    Cooking: { icon: FaConciergeBell, color: "text-[#FFBA08]" },
    Ready: { icon: FaUtensils, color: "text-blue-500" },
    Served: { icon: FaCheckCircle, color: "text-green-500" },
    Billed: { icon: FaMoneyBillWave, color: "text-indigo-500" },
    Completed: { icon: FaCheckCircle, color: "text-green-500" },
  };

  const currentStatusMapping = defaultStatusMapping[status];

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white grid grid-cols-3 gap-4 text-center hover:bg-gray-300 transition-all duration-300 cursor-pointer">
      {/* Table Info */}
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg border border-black">
          <span className="text-sm font-semibold text-black">{order.tableNumber}</span>
        </div>
        <div className="ml-4 flex items-center">
          {currentStatusMapping?.icon && (
            <currentStatusMapping.icon className={`${currentStatusMapping.color} w-6 h-6`} />
          )}
        </div>
      </div>
      {/* Order Items */}
      <div className="flex flex-col justify-center border-r border-l border-gray-500 lg:px-14 items-start xl:px-36">
        {order.items.map((item, index) => (
          <p key={index} className="text-gray-600 text-md mb-2">
            {item.name} {item.size && `- ${item.size}`} x {item.quantity}
          </p>
        ))}
      </div>
      {/* Status Dropdown / Display */}
      <div className="flex flex-col items-center justify-center">
        {allowedOptions.length > 0 ? (
          <Menu as="div" className="relative inline-block">
            <Menu.Button
              className="flex items-center justify-between w-40 px-4 py-2 rounded-lg border shadow-sm bg-white cursor-pointer"
              style={{
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                border: "1px solid #E5E7EB",
                width: "200px",
              }}
            >
              <div className="flex items-center">
                {currentStatusMapping?.icon && (
                  <currentStatusMapping.icon className={`w-5 h-5 mr-2 ${currentStatusMapping.color}`} />
                )}
              </div>
              <span className="text-black font-medium flex-1 text-center">{status}</span>
              <FiChevronDown className="w-5 h-5 text-gray-600" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border z-10 border-gray-200 rounded-md shadow-lg focus:outline-none">
              {allowedOptions.map((option) => (
                <Menu.Item key={option.value}>
                  {({ active }) => (
                    <button
                      onClick={() => handleStatusChange(option.value)}
                      className={`w-full flex items-center px-4 py-2 text-left ${active ? "bg-gray-100" : ""}`}
                    >
                      <option.icon className={`w-5 h-5 mr-2 ${option.color}`} />
                      <span className={`${option.color}`}>{option.value}</span>
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
        ) : (
          <div className="w-40 px-4 py-2 rounded-lg border shadow-sm bg-gray-100">
            <span className="text-black font-medium flex-1 text-center">{status}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
