"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import NavBar from '@/components/MenuSide/NavBar';
import { useRouter } from "next/navigation";
import MyOrderCard from "@/components/MenuSide/MyOrderCard";
import { subScribeToOrders } from "@/service/orderService"; 

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const orders = useSelector((state: RootState) => state.order.orders);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { 
    setMounted(true);
    setPhoneNumber(localStorage.getItem("phoneNumber"));
  }, []);
  useEffect(() => {
    const unsubscribe = subScribeToOrders(dispatch);
    return () => unsubscribe();
  }, [dispatch]);

 
  if (!mounted) {
    return null; 
  }

  const userOrders = orders.filter((order) => order.phoneNumber === phoneNumber);

  return (
    <div>
      <NavBar />
      <div className="p-2 bg-white min-h-screen">
        <div className="flex justify-center items-center w-full">
          <div className="bg-[#212121] text-[#FAAB38] px-6 py-3 rounded-md shadow-md text-center w-full">
            My Order List
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full mx-auto mt-3">
          {phoneNumber ? (
            userOrders.length === 0 ? (
              <p className="text-black">No orders Found</p>
            ) : (
              userOrders.map((order) => (
                <MyOrderCard key={order.id} order={order} />
              ))
            )
          ) : (
            <p className="text-black">No Phone number found.. Please Login</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
