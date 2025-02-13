"use client"
import React,{useState} from 'react'
import { FiX } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { addSupplier, fetchSuppliers } from '@/redux/features/supplierSlice'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'

interface SupplierProps{
    isOpen:boolean;
    onClose:() => void;
}

const SupplierCreate = ({isOpen, onClose}:SupplierProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const {loading, error} = useSelector((state:RootState) => state.supplier)
    const [formData, setFormData] = useState({
        name:"",
        contact:"",
        address:"",
    });
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setFormData({...formData,[e.target.name]:e.target.value});
    }
    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(!formData.address || !formData.name || !formData.contact){
            Swal.fire({
                title:"Missing Inputs",
                text:"Please Fill in all the fields",
                icon:'error',
                confirmButtonText:"Try Again",
            });
            return;
        }

        try {
            await dispatch(addSupplier(formData)).unwrap();
            dispatch(fetchSuppliers());
            onClose();
        } catch (error) {
            console.error("Failed to add Supplier:",error);
            alert(error || "Failed to create Supplier.");
        }
    };
    if(!isOpen) return null;


  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-85'>
        <div className='bg-white p-6 rounded-lg shadow-lg w-[450px] relative'>
            <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl font-semibold text-gray-900'>Create Supplier</h2>
                <button onClick={onClose} className='text-gray-500 text-2xl hover:text-gray-700'>
                    <FiX/>
                </button>
            </div>
            <form onSubmit={handleSubmit} className='text-black'>
                <div className='space-y-4'>
                    <div>
                        <label htmlFor="name" className='block text-gray-700 font-medium'>Supplier Name</label>
                        <input type="text" name='name' value={formData.name} onChange={handleChange} 
                        className='w-full p-2 border border-gray-300 rounded mt-1' 
                        />
                    </div>
                    <div>
                        <label 
                        htmlFor="contact" 
                        className='block text-gray-700 font-medium'>Address</label>
                        <input 
                        type="text" 
                        value={formData.address}
                        name='address'
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded mt-1'
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor="contact" className='block text-gray-700 font-medium'>Contact</label>
                        <input 
                        type="text" 
                        name='contact'
                        value={formData.contact}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded mt-1'
                        />
                    </div>
                    <button
                     type='submit'
                     className="w-full bg-customblue text-white py-2 rounded-md hover:bg-blue-900 cursor-pointer"
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </form>
        </div>

    </div>
  )
}

export default SupplierCreate