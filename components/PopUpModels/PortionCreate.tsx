"use client"
import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { RootState } from '@/redux/store'
import { addPortion, fetchPortions } from '@/redux/features/portionSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
interface PortionProps{
    isOpen:boolean;
    onClose: () => void;

}
const PortionCreate = ({isOpen, onClose}:PortionProps) => {
    const [portionName, setPortionName] = useState("");
    const [portionServe, setPortionServes] = useState("");
    const dispatch = useDispatch<any>();
    const {loading, error} = useSelector((state:RootState) => state.portionType);
    if(!isOpen) return null;

    const handleCreate = async () =>{
        if(!portionName) return;

        try {
            await dispatch(addPortion({name:portionName, serves:portionServe})).unwrap();
            setPortionName("");
            setPortionServes("");
            dispatch(fetchPortions());
            onClose();
        } catch (error) {
            console.error("Error creating portion:",error);
        }
    };
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-85'>
        <div className='bg-white p-6 rounded-lg shadow-lg w-[400px] relative'>
            <button onClick={onClose} className='absolute top-3 right-3 text-gray-700 text-2xl'>
                <FiX/>
            </button>
            <h2 className='text-xl font-semibold text-center mb-4 text-customGold'>Create Portion</h2>

            <div className='mb-3'>
                <label className='block text-gray-700 font-medium'>Name</label>
                <input 
                    type="text" 
                    value={portionName}
                    onChange={(e) => setPortionName(e.target.value)}
                    className='w-full border rounded-md p-2 text-black'
                    placeholder='Enter Portion Name'
                />
            </div>
            <div className='mb-4'>
                <label className='block text-gray-700 font-medium'>Served Persons</label>
                <div className='flex items-center border rounded-md p-2'>
                    <input 
                        type="text" 
                        value={portionServe}
                        onChange={(e) => setPortionServes(e.target.value)}
                        className='w-full ml-2 outline-none text-black'
                        placeholder='Served Persons'
                    />
                </div>
            </div>
            <button 
            onClick={handleCreate}
            disabled={loading}
            className='w-full bg-customGold text-white py-2 rounded-md hover:bg-orange-500 cursor-pointer'>
                {loading ? "Creating...":"Create"}
            </button>
        </div>
    </div>
  )
}

export default PortionCreate