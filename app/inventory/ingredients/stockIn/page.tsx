"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import StockInHeading from "@/components/Headings/StockInHeading";
import { fetchTransactions } from "@/redux/features/transactionSlice";
import TransactionCard from "@/components/TransactionCard";
import { months } from "@/constants/months";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const { transactions, loading, error } = useSelector(
    (state: RootState) => state.transactions
  );

  const availableYears = Array.from(
    new Set(transactions.map((txn) => new Date(txn.date).getFullYear().toString()))
  ).sort();

  useEffect(() => {
    if (!selectedYear && availableYears.length > 0) {
      setSelectedYear(availableYears[0]);
    }
    if (!selectedMonth) {
      setSelectedMonth(new Date().getMonth().toString());
    }
  }, [availableYears, selectedMonth, selectedYear]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.ingredientName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    let matchesType = false;
    if (transactionTypeFilter === "All") {
      matchesType = true;
    } else if (
      transactionTypeFilter === "Stock In" &&
      transaction.transactionType === "StockIn"
    ) {
      matchesType = true;
    } else if (
      transactionTypeFilter === "Stock Out" &&
      transaction.transactionType === "StockOut"
    ) {
      matchesType = true;
    }

    let matchesDate = true;
    if (selectedMonth !== "") {
      const txnMonth = new Date(transaction.date).getMonth();
      if (txnMonth !== Number(selectedMonth)) {
        matchesDate = false;
      }
    }
    if (selectedYear !== "") {
      const txnYear = new Date(transaction.date).getFullYear().toString();
      if (txnYear !== selectedYear) {
        matchesDate = false;
      }
    }

    return matchesSearch && matchesType && matchesDate;
  });

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 h-screen bg-beige ml-14 w-full">
        {/* Header with title and search */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-customGold">
            Transaction Records
          </h1>
          <SearchBar placeholder="Search Records" onSearch={setSearchQuery} />
        </div>
        <div className="mb-4 flex justify-between items-center flex-wrap">
          <div className="flex gap-4 items-center">
            <button
              className={`px-4 py-2 rounded ${
                transactionTypeFilter === "All"
                  ? "bg-customGold text-white"
                  : "bg-white text-black border border-customorange"
              }`}
              onClick={() => setTransactionTypeFilter("All")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded ${
                transactionTypeFilter === "Stock In"
                  ? "bg-customGold text-white"
                  : "bg-white text-black border border-customorange"
              }`}
              onClick={() => setTransactionTypeFilter("Stock In")}
            >
              Stock In
            </button>
            <button
              className={`px-4 py-2 rounded ${
                transactionTypeFilter === "Stock Out"
                  ? "bg-customGold text-white"
                  : "bg-white text-black border border-customorange"
              }`}
              onClick={() => setTransactionTypeFilter("Stock Out")}
            >
              Stock Out
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <p className="font-bold text-customGold">Date:</p>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300 text-black"
            >
              <option value="">Month</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300 text-black"
            >
              <option value="">Year</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <StockInHeading />
        <div className="mt-4">
          {loading ? (
            <p className="text-black">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
              />
            ))
          ) : (
            <p className="text-black">
              {searchQuery ? "No Records found" : "No Records Available"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
