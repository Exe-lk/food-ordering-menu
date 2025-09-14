"use client"
import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { addMenu, clearError, fetchMenus } from '@/redux/features/menuSlice';
import Swal from 'sweetalert2';

interface MenuProps{
    isOpen:boolean;
    onClose: () => void;
}

const MenuCreate = ({isOpen, onClose}:MenuProps) => {
    const [menuName, setMenuName] = useState("");
    const [menuType, setMenuType] = useState("");
    const dispatch = useDispatch<any>();
    const [image, setImage] = useState<File | null>(null);
    const {loading, error} = useSelector((state:RootState) => state.menuType);
    if(!isOpen) return null;

    const handleCreate = async () => {
        if (!menuName || !image) return;
    
        try {
            await dispatch(addMenu({menuName, image, menu_type:menuType})).unwrap(); 
            setMenuName("");
            dispatch(fetchMenus());
            onClose();
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: (error as string) || "Failed to create category.",
                icon: "error",
                });
            dispatch(clearError())
        }
    };

    const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        if(e.target.files && e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }
    
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-85'>
        <div className='bg-white p-6 rounded-lg shadow-lg w-[400px] relative'>
            <button onClick={onClose} className='absolute top-3 right-3 text-gray-700 text-2xl'>
                <FiX/>
            </button>
            <h2 className='text-xl font-semibold text-center mb-4 text-customGold'>Create Menu</h2>
            <div className='mb-3'>
                <label className='block text-gray-700 font-medium'>Menu Name</label>
                <input 
                    type="text" 
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    className='w-full border rounded-md p-2 text-black'
                    placeholder='Ex: Italian'
                />
            </div>
            <div className="mb-3">
            <label className="block text-gray-700 font-medium">Menu Type</label>
            <select
                value={menuType}
                onChange={(e) => setMenuType(e.target.value)}
                className="w-full border rounded-md p-2 text-black"
                required
            >
                <option value="" disabled>
                Select Menu Type
                </option>
                <option value="Bar">Bar</option>
                <option value="Food">Food</option>
            </select>
            </div>
            <div className='mb-3'>
                <label htmlFor="#" className='block text-gray-700 font-medium'>Upload Image</label>
                <input 
                    type="file" 
                    accept='image/*'
                    onChange={handleImageChange}
                    className='w-full border rounded-md p-2 text-black'
                />
            </div>
            <button 
            onClick={handleCreate}
            disabled={loading}
            className='w-full bg-customGold text-white py-2 rounded-md hover:bg-orange-500 cursor-pointer'>
                {loading ? "Creating..." :"Create"}
            </button>
        </div>
    </div>
  )
}

export default MenuCreate