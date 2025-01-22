"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

const MenuType = () => {

  const router = useRouter();

  return (
    <div className='flex flex-col items-center bg-black min-h-screen p-6'>
      <h1 className='text-white text-2xl font-bold mb-4'>Select Menu</h1>
      <hr className='border-gray-300 w-full mb-6' />
      <div className='grid grid-cols-1 w-full gap-2 justify-center items-center'>
        <div 
        className='relative rounded-lg overflow-hidden cursor-pointer'
        onClick={() => router.push('/menu/home/menu')}
        >
          <img
            src='/assets/menus/food.jpg'
            alt='Food Menu'
            className='w-full h-52 object-cover'
          />
           <div className="absolute inset-0 bg-black bg-opacity-75"></div>
          <div
            className='absolute inset-0 flex items-center justify-center'
          >
            <h2 className='text-white text-2xl font-semibold'>Food Menu</h2>
          </div>
        </div>

        <div 
        className='relative rounded-lg overflow-hidden cursor-pointer'
        onClick={() => router.push('/menu/home/bar')}
        >
          <img
            src='/assets/menus/bar.jpg'
            alt='Food Menu'
            className='w-full h-52 object-cover'
          />
           <div className="absolute inset-0 bg-black bg-opacity-70"></div>
          <div
            className='absolute inset-0 flex items-center justify-center'
          >
            <h2 className='text-white text-2xl font-semibold'>Bar Menu</h2>
          </div>
        </div>
      </div>

    </div>
  )
}

export default MenuType