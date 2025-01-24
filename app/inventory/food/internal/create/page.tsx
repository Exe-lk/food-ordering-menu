"use client";

import React, { useState } from "react";
import menuData from "@/data/menus";
import portionOptions from "@/data/portionst+";
import Form from "@/components/ProductForm";
import { FiMenu } from "react-icons/fi";
import Sidebar from "@/components/Sidebar";

const page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log("Form Submitted: ", data);
  };

  const categories = menuData.map((menu) => menu.name);

  return (
    <div className="p-4 min-h-screen bg-gradient-to-b from-[#EDD3B3] to-white">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-2xl text-black"
        >
          <FiMenu />
        </button>
        <h1 className="text-3xl font-bold text-black mx-auto">Add Product</h1>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="min-h-screen flex items-center justify-center">
        <Form
          categories={categories}
          portionOptions={portionOptions}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default page;
