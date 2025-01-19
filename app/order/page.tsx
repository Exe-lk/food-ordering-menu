"use client";
import React, { useState } from "react";
import OrderCard from "./_components/OrderCard";
import { FiMenu } from "react-icons/fi";
import { orders } from "@/data/order";

const Page = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  // Filtering orders
  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <button className="text-2xl text-black">
          <FiMenu />
        </button>
        <h1 className="text-3xl font-bold text-black text-center">Order Management</h1>
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-6">
        {["All", "Served", "Ready", "Cooking", "New Order"].map((filter) => (
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order, index) => (
          <OrderCard
            key={index}
            name={order.name}
            table={order.table}
            items={order.items}
            total={order.total}
            status={order.status as "Ready" | "Cooking" | "Served" | "New Order"}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
