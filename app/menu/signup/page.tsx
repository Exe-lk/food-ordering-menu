"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCustomerDetails } from '@/redux/features/customerSlice';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchOrders, Order } from '@/redux/features/orderSlice';

const page = () => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState(""); 
  const phone = typeof window !== "undefined" ? localStorage.getItem("phone") : null;
  const orders = useSelector((state: RootState) => state.order.orders);


  const isValidPhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleClick = async () => {
    // Check if all required fields are provided.
    if (!name || !tableNumber || !phone) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill in all fields!",
      });
      return;
    }

    // Validate the phone number format.
    if (!isValidPhoneNumber(phone)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "The phone number is not valid. Please check the number.",
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

      // If no active order occupies the selected table, update customer details.
      await dispatch(updateCustomerDetails({ phone, name, tableNumber })).unwrap();
      router.push("/menu/home");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An error occurred while checking table availability.",
      });
    }
  };


  return (
    <div className='container mx-auto'>
      <div className='flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat' style={{ backgroundImage: 'url(/images/background/authback.jpg)' }}>
        <div className='bg-black p-6 rounded-lg w-80'>
          <h1 className='text-white text-xl font-semibold text-left mb-6'>Name</h1>
          <input 
            type="text" 
            placeholder='Your Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full px-4 py-3 rounded-md text-sm bg-gray-300 text-black outline-none focus:ring-2 focus:ring-red-600 mb-6'
          />
          <h1 className='text-white text-xl font-semibold text-left mb-6'>Table Number</h1>
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
  );
};

export default page;
