import { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'

const CartSection = () => {
    const totalItems = useSelector((state: RootState) => state.cart.totalItems);

    if(totalItems === 0) return null;
  return (
    <div className='fixed bottom-0 left-0 right-0 bg-red-800 text-white px-4 py-2 flex justify-between items-center shadow-lg'>
        <span>{totalItems} Item in Cart</span>
        <button className='text-white px-4 rounded'>
            View Cart &gt;
        </button>

    </div>
  )
}

export default CartSection