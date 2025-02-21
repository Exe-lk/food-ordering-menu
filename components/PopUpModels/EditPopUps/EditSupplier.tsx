"use client";
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchSuppliers, updateSupplier } from "@/redux/features/supplierSlice";

interface Supplier{
   id:string;
    name:string;
    address:string;
    contact:string;
    created_at:string;
    created_by?:string;
    updated_at?: string; 
    updated_by?: string;
    isDeleted:boolean;
}

interface SupplierEditProps{
    isOpen:boolean;
    onClose:() => void;
    supplier:Supplier;
}

const EditSupplier = ({isOpen, onClose, supplier}:SupplierEditProps) => {
    const dispatch = useDispatch<any>();
    const {loading} = useSelector((state:RootState) =>state.supplier);
    const [name, setName] = useState(supplier.name);
    const [contact, setContact] = useState(supplier.contact);
    const [address, setAddress] = useState(supplier.address);

    useEffect(() =>{
        if(supplier){
            setName(supplier.name);
            setAddress(supplier.address)
            setContact(supplier.contact)
        }
    },[supplier]);

    const handleUpdate = async () =>{
        if(name === supplier.name && contact === supplier.contact && address === supplier.address) return;
        try {
            await dispatch(
                updateSupplier({
                    id:supplier.id,
                    updatedName:supplier.name,
                    updatedAddress:supplier.address,
                    updatedContact:supplier.contact
                })
            ).unwrap();
            dispatch(fetchSuppliers());
            onClose();
        } catch (error) {
            console.error("Error Updating Supplier: ", error);
        }
    };

    if(!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-85">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-700 text-2xl"
            >
                <FiX/>
            </button>
            <h2 className="text-xl font-semibold text-center mb-4 text-customGold">Edit Supplier</h2>
            <div className="mb-3">
                <label htmlFor="name" className="text-gray-700 font-medium">Name</label>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-md p-2 text-black"
                    placeholder="Enter Supplier Name"
                    />
            </div>
            <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700 font-medium">Address</label>
                <input 
                    type="text" 
                    value={address}
                    onChange={(e)=> setAddress(e.target.value)}
                    className="w-full ml-2 outline-none text-black"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="contact" className="block text-gray-700 font-medium">Contact</label>
                <input 
                    type="text" 
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full ml-2 outline-none text-black"
                    
                />
            </div>
        </div>
        <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-customGold text-white py-2 rounded-md hover:bg-orange-500 cursor-pointer"
        >
            {loading ? "Updating..." : "Update"}
        </button>

    </div>


  )
}

export default EditSupplier