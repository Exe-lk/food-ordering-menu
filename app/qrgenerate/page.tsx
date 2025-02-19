"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

const page = () => {
  return (
    <div className="flex">
        <Sidebar/>
        <div className="p-4 min-h-screen bg-beige w-full ml-14">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-customGold">Generate QR</h1>
            </div>
        </div>
    </div>
  )
}

export default page