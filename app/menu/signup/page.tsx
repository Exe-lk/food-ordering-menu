"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCustomerDetails } from '@/redux/features/customerSlice';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchOrders, Order } from '@/redux/features/orderSlice';
import NavBar from '@/components/MenuSide/NavBar';

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
    <div>
      <NavBar/>
      <div className='relative bg-white min-h-screen'>
        <div className='container mx-auto flex flex-col xl:flex-row items-center justify-evenly px-6 md:px-12 py-12 x-10 bg-white'>
        <div className="relative w-full h-96 md:w-[500px] md:h-[500px] rounded-full overflow-hidden z-10 mt-24 order-last xl:order-first">
              <img
                src="/assets/plate.jpg"
                alt="Delicious Food"
                className="object-cover w-full h-full"
              />
          </div>
          <div className='bg-beige p-6 rounded-lg w-full xl:w-[30%] z-20 mt-20 md:mt-0'>
            <h1 className='text-customorange text-xl font-semibold text-left mb-6'>Name</h1>
            <input 
              type="text" 
              placeholder='Your Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full px-4 py-3 rounded-md text-sm bg-white text-black border border-customorange mb-6'
            />
            <h1 className='text-customorange text-xl font-semibold text-left mb-6'>Table Number</h1>
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
              className='w-full bg-customorange text-white font-medium py-3 rounded-md text-center'
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
