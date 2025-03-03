"use client"
import { updateCustomerDetails } from '@/redux/features/customerSlice';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { fetchOrders, Order } from '@/redux/features/orderSlice';
import NavBar from '@/components/MenuSide/NavBar';
import Cookies from "js-cookie"

const page = () => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const orders = useSelector((state: RootState) => state.order.orders);
  const phone = typeof window !== "undefined" ? localStorage.getItem("phone") : null;

  const handleClick = async () => {
    if (!tableNumber || !phone) {
      Swal.fire({
        icon: 'error',
        title: "Missing Information",
        text: "Please Select a Table Number",
        confirmButtonText: "Okay"
      });
      return;
    }
    setLoading(true);
    try {
      const orders = await dispatch(fetchOrders()).unwrap();
      const tableOccupied = orders.some((order: Order) =>
        order.tableNumber === tableNumber && !["Completed", "Rejected"].includes(order.status)
      );
      if (tableOccupied) {
        Swal.fire({
          icon: "error",
          title: "Table Occupied",
          text: "This table is currently in use by an ongoing order. Please choose a different table.",
        });
        return;
      }
      localStorage.setItem("tableNumber", tableNumber);
      Cookies.set("tableNumber",tableNumber,{expires:1});
      await dispatch(updateCustomerDetails({ phone, name: "", })).unwrap();
      router.push('/menu/home');
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An error occurred while checking table availability.",
      });
    } finally {
      setLoading(false);
    }   
  }
    
  return (
    <div>
      <NavBar />
      <div className='relative bg-white min-h-screen'>
        <div className='container mx-auto flex flex-col xl:flex-row items-center justify-evenly px-6 md:px-12 py-12 z-10 bg-white'>
          <div className="relative w-full h-96 md:w-[500px] md:h-[500px] rounded-full overflow-hidden z-10 mt-24 order-last xl:order-first">
            <img
              src="/assets/plate.jpg"
              alt="Delicious Food"
              className="object-cover w-full h-full"
            />
          </div>
          <div className='bg-white p-6 rounded-lg w-full xl:w-[30%] z-20 mt-20 md:mt-0'>
            <h1 className='text-customorange text-xl font-semibold text-center mb-6'>Table Number</h1>
            <select 
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className='w-full px-4 py-3 rounded-md text-sm bg-white text-black border border-customorange mb-6'
            >
              <option value="">Select Table Number</option>
              {[...Array(10).keys()].map((val) => {
                const tableVal = val + 1;
                return (
                  <option key={tableVal} value={tableVal}>
                    {tableVal}
                  </option>
                );
              })}
            </select>
            <button
              onClick={handleClick}
              disabled={loading}
              className='w-full bg-customorange text-white font-medium py-3 rounded-md text-center'
            >
              {loading ? "Loading..." : "Next"}
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-black rounded-t-[50%]"></div>
      </div>
    </div>
  )
}

export default page;
