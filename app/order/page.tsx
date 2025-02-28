"use client";
import React, { useEffect, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const {orders, loading, error} = useSelector((state:RootState) => state.order)
  
  useEffect(() =>{
    const unsubscribe = subScribeToOrders(dispatch);
    return () =>{
      unsubscribe();
    };
  },[dispatch])


  const filteredOrders = orders.filter((order) => {
    const statusMatches = activeFilter === "All" || order.status === activeFilter;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return statusMatches;
    const tableMatches = order.tableNumber.toString().toLowerCase().includes(query);

    const itemsMatch = order.items.some((item) =>
      item.name.toLowerCase().includes(query)
    );
    return statusMatches && (tableMatches || itemsMatch);
  });

  return (
    <div className="flex">
      <Sidebar/>
      <div className="p-4 min-h-screen bg-beige ml-14 w-full" >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-customGold text-center">
          Order Management
        </h1>
       <SearchBar placeholder="Search Orders" onSearch={setSearchQuery} />
      </div>
      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-6">
        {["All", "Served", "Ready", "Cooking", "Pending","Billed","Completed"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-md border ${
              activeFilter === filter
                ? "bg-customGold text-white font-bold"
                : "bg-white text-gray-700 border-customGold hover:bg-gray-100"
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
