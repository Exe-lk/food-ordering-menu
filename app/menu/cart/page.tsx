"use client"

import { removeFromCart, RootState } from '@/redux/store';
import React from 'react'
import { FaTrashAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'

const CartPage = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state:RootState) => state.cart.items);
    const subTotal = cartItems.reduce((total,item) => total + item.price * item.quantity,0);
    const taxes = Math.round(subTotal * 0.125);
    const grandTotal = subTotal + taxes;

    const handleRemove = (name:string, portion:string) =>{
        dispatch(removeFromCart({name, portion}));
    };

  return (
    <div className='bg-black min-h-screen text-white p-4'>
        <div className='max-w-2xl mx-auto'>
            {cartItems.map((item,index) => (
                <div key={index} className='bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center shadow-md'>
                    <img 
                    src={item.image}
                    alt={item.name} 
                    className='w-20 h-20 object-cover rounded'
                    />
                    <div className='flex-grow px-4'>
                        <h3 className='font-bold'>{item.name}</h3>
                        <p className='text-sm'>{item.portion}</p>
                        <div className='flex items-center mt-2'>
                            <button className='bg-gray-600 px-3 py-1 rounded-r text-white' onClick={() => {}}>
                                -
                            </button>
                            <span className='px-3'>{item.quantity}</span>
                            <button className='bg-gray-600 px-3 py-1 rounded-r text-white' onClick={() => {}}>
                                +
                            </button>
                        </div>
                    </div>
                    <p className='text-lg font-bold'>{item.price * item.quantity} LKR</p>
                    <button onClick={() => handleRemove(item.name, item.portion)} className='ml-4 bg-red-600 text-white'>
                        <FaTrashAlt size={20}/>
                    </button>
                </div>
            ))}
            <div className='bg-gray-900 p-4 rounded-lg text-sm shadow-lg'>
                <div className='flex justify-between'>
                    <span>Sub Total</span>
                    <span>{subTotal} LKR</span>
                </div>
                <div className='flex justify-between'>
                    <span>Taxes</span>
                    <span>{taxes} LKR</span>
                </div>
                <div className='flex justify-between text-lg font-bold mt-2'>
                    <span>Total</span>
                    <span>{grandTotal} LKR</span>
                </div>
            </div>
            <button className='bg-blue-600 w-full py-3 text-center text-lg font-bold rounded-md mt-4'>
                Place Order
            </button>
        </div>
    </div>
  )
}

export default CartPage