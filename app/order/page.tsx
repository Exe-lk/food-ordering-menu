"use client";
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { orders as initialOrders } from "@/data/order";
import OrderGrid from "../../components/DataGrid";
import Sidebar from "@/components/Sidebar";

const Page = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [orders, setOrders] = useState(initialOrders);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  const handleStatusChange = (id: number, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <button 
        onClick={() => setIsSidebarOpen(true)}
        className="text-2xl text-black">
          <FiMenu />
        </button>
        <h1 className="text-3xl font-bold text-black text-center">
          Order Management
        </h1>
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-6">
        {["All", "Served", "Ready", "Cooking", "Pending"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-md border ${
              activeFilter === filter
                ? "bg-blue-500 text-white font-bold"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      {/* Orders Grid */}
      <OrderGrid orders={filteredOrders} handleStatusChange={handleStatusChange} />
    </div>
  );
};

export default Page;
