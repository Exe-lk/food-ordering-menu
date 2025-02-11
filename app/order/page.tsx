"use client";
import React, { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchOrders } from "@/redux/features/orderSlice";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import TableHeading from "@/components/Headings/TableHeading";
import OrderCard from "@/components/OrderCard";
import { subScribeToOrders } from "@/service/orderService";

const Page = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const {orders, loading, error} = useSelector((state:RootState) => state.order)
  
  useEffect(() =>{
    const unsubscribe = subScribeToOrders(dispatch);
    return () =>{
      unsubscribe();
    };
  },[dispatch])


  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

      const handleStatusChange = (id: number, newStatus: string) => {
      };

  return (
    <div className="flex">
      <Sidebar/>
      <div className="p-4 min-h-screen bg-beige ml-14 w-full" >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-customblue text-center">
          Order Management
        </h1>
       <SearchBar placeholder="Search Orders" onSearch={setSearchQuery} />
      </div>
      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-6">
        {["All", "Served", "Ready", "Cooking", "Pending"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-md border ${
              activeFilter === filter
                ? "bg-customblue text-white font-bold"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>    
      <TableHeading headings={["Table", "Items", "Status"]}/>
      <div className="min-h-screen flex flex-col gap-6 mt-5">
        {filteredOrders.map((order) => (
          <OrderCard 
            key={order.id}
            order={order}
          />
        ))}
      </div>
    </div>
    </div>
  );
};

export default Page;
