"use client"
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { fetchStockOutRecords } from "@/redux/features/stockOutSlice";
import StockOutHeading from "@/components/Headings/StockOutHeading";
import StockOutCard from "@/components/Inventory/StockOutCard";
const page = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const {stockOut, loading, error} = useSelector((state:RootState) => state.stockOut);
    const filteredStock = stockOut.filter((stock) =>
        stock.ingredientName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    useEffect(() => {
        dispatch(fetchStockOutRecords())
    },[dispatch])
  return (
    <div className="flex">
        <Sidebar/>
        <div className="p-4 h-screen bg-beige ml-14 w-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-customblue">Stock Out Records</h1>
                <SearchBar placeholder="Search Records" onSearch={setSearchQuery}/>
            </div>
            <StockOutHeading/>
            <div className="mt-4">
                {loading ?(
                    <p className="text-black">Loading...</p>
                ): error ?(
                    <p className="text-red-500">{error}</p>
                ): filteredStock.length > 0 ? (
                    filteredStock.map((stock) =>(
                        <StockOutCard
                            key={stock.id}
                            name={stock.ingredientName}
                            category={stock.category}
                            quantity={stock.stockOutQuantity}
                            dateIn={stock.dateOut}
                            reason={stock.reason}
                        />
                    ))
                ):(
                    <p className="text-black">
                    {searchQuery ? "No Records found" : "No Records Available"}
                    </p>
                )}
            </div>
        </div>
    </div>
  )
}

export default page