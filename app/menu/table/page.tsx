"use client"
import { updateCustomerDetails } from '@/redux/features/customerSlice';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { fetchOrders, Order } from '@/redux/features/orderSlice';

const page = () => {
    const router = useRouter();
    const dispatch = useDispatch<any>();
    const [tableNumber, setTableNumber] = useState("");
    const orders = useSelector((state:RootState) => state.order.orders);
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
      try {
        const orders = await dispatch(fetchOrders()).unwrap();
        const tableOccupied = orders.some((order: Order) =>
        order.tableNumber === tableNumber && order.status !== "Completed"
        );
        if (tableOccupied) {
        Swal.fire({
            icon: "error",
            title: "Table Occupied",
            text: "This table is currently in use by an ongoing order. Please choose a different table.",
            });
            return;
          }
          await dispatch(updateCustomerDetails({ phone, name: "", tableNumber })).unwrap();
          router.push('/menu/home');
      } catch (error:any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "An error occurred while checking table availability.",
        });
        
      }   
      
    }
    
  return (
    <div className='container mx-auto'>
        <div className='flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(/images/background/authback.jpg)'}}>
        <div className='bg-black p-6 rounded-lg w-96'>
            <h1 className='text-white text-xl font-semibold text-center mb-6'>Table Number</h1>
            <select 
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className='w-full px-4 py-3 rounded-md text-sm bg-gray-300 text-black outline-none focus:ring-2 focus:ring-red-600 mb-6'
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
                className='w-full bg-blue-600 text-white font-medium py-3 rounded-md text-center'
            >
                Next
            </button>
        </div>
        </div>
    </div>
  )
}

export default page