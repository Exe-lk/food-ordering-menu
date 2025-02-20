"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import Confirm from '@/components/PopUpModels/Confirm';
import RecycleBinButton from '@/components/RecycleBin';
import { fetchSuppliers, removeSupplier } from '@/redux/features/supplierSlice';
import Sidebar from '@/components/Sidebar';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import SupplierHeading from '@/components/Headings/SupplierHeading';
import SupplierCard from '@/components/SupplierCard';
import SupplierCreate from '@/components/PopUpModels/SupplierCreate';
import EditSupplier from '@/components/PopUpModels/EditPopUps/EditSupplier';
import RecycleModal from '@/components/RecycleModal';

const page = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const dispatch = useDispatch<any>();
    const [searchQuery, setSearchQuery] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
    const {suppliers, loading, error, fetched} = useSelector((state:RootState)=>state.supplier)
    const [localSuppliers, setLocalSupplier] =useState(suppliers);

    useEffect(() =>{
        if(!fetched){
            dispatch(fetchSuppliers());
        }
    },[fetched, suppliers])
    useEffect(() =>{
        if(suppliers.length > 0){
            setLocalSupplier(suppliers)
        }
    },[suppliers])

    const handleEdit = (index:number)=>{
        setSelectedIndex(index)
        setIsEditOpen(true);
    };

    const handleRemove = (index:number) =>{
        setSelectedIndex(index)
        setIsConfirmOpen(true);
    }

    const confirmRemove = async () =>{
        if(selectedIndex !== null){
            try {
                await dispatch(removeSupplier({id:localSuppliers[selectedIndex].id})).unwrap();
                dispatch(fetchSuppliers());
                setIsConfirmOpen(false);
                setSelectedIndex(null)
            } catch (error) {
                console.error("Error Removing Employee: ", error);
            }
        }
    }

  return (
    <div className='flex'>
        <Sidebar/>
        <div className='p-4 min-h-screen bg-beige ml-14 w-full'>
            <div className='flex items-center justify-between mb-6'>
                <h1 className='text-3xl font-bold text-customGold'>Supplier Management</h1>
                <SearchBar placeholder='Search Suppliers' onSearch={setSearchQuery} />
            </div>
            <div className="flex space-x-4 mt-4 items-start justify-start w-full mb-3">
                <Button onClick={() => setIsPopupOpen(true)} label='Create Supplier' variant='primary'/>
            </div>
            <SupplierHeading/>
            {loading ?(
                <p className='text-black'>Loading...</p>
            ): localSuppliers.length > 0 ?(
                <SupplierCard suppliers={localSuppliers} onEdit={handleEdit} onRemove={handleRemove}/>
            ): error?(
                <p className='text-red-500'>{error}</p>
            ):(
                <p className='text-black'>No Available Suppliers</p>
            )}
            <RecycleBinButton onClick={() => setIsRecycleBinOpen(true)}/>
            <SupplierCreate isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}/>
            {selectedIndex !== null &&(
                <EditSupplier
                isOpen={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false)
                    setSelectedIndex(null)
                }}
                supplier={localSuppliers[selectedIndex]}
                />
            )}
            <Confirm
                message='Are you sure you want to delete the Supplier?'
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmRemove}
            />
            <RecycleModal isOpen={isRecycleBinOpen} onClose={() => setIsRecycleBinOpen(false)} recycleType='supplier'/>
        </div>
    </div>
  )
}

export default page