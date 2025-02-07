"use client"
import { updateCustomerDetails } from '@/redux/features/customerSlice';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

const page = () => {
    const router = useRouter();
    const dispatch = useDispatch<any>();
    const [tableNumber, setTableNumber] = useState("");
    const phone = typeof window !== "undefined" ? localStorage.getItem("phone") : null;

    const handleClick = async () =>{
        if(!tableNumber || !phone) return;
        await dispatch(updateCustomerDetails({phone, name:"",tableNumber})).unwrap();
        router.push('/menu/home')   
    }
  return (
    <div className='container mx-auto'>
        <div className='flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(/images/background/authback.jpg)'}}>
        <div className='bg-black p-6 rounded-lg w-96'>
            <h1 className='text-white text-xl font-semibold text-center mb-6'>Table Number</h1>
            <input 
            type="text" 
            placeholder='Table Number'
            className='w-full px-4 py-3 rounded-md text-sm bg-gray-300 text-black outline-none focus:ring-2 focus:ring-red-600 mb-6'
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            />
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