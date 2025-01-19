"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
const page = () => {
    const router = useRouter();
    const handleClick = () =>{
        router.push("/menu/home");
    };
  return (
    <div className='container mx-auto'>
        <div className='flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(/images/background/authback.jpg)'}}>
        <div className='bg-black p-6 rounded-lg w-80'>
            <h1 className='text-white text-xl font-semibold text-center mb-6'>Phone Number</h1>
            <input 
            type="number" 
            placeholder='Enter your phone number'
            className='w-full px-4 py-3 rounded-md text-sm bg-gray-300 text-black outline-none focus:ring-2 focus:ring-red-600 mb-6'
            />
            <button
                onClick={handleClick}
                className='w-full bg-blue-600 text-white font-medium py-3 rounded-md text-center'
            >Next</button>
        </div>
        </div>
    </div>
  )
}

export default page