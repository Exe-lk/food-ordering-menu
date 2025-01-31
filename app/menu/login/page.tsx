"use client"
import { useRouter } from 'next/navigation'
import React,{useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkPhoneExists } from '@/redux/features/customerSlice'
import { RootState } from '@/redux/store'
const page = () => {
    const router = useRouter();
    const dispatch = useDispatch<any>();
    const [phone, setPhone] = useState("");
    const {exists, loading} = useSelector((state:RootState) =>state.customer);
    
    const handleClick = async () =>{
        if(!phone) return;
        const result = await dispatch(checkPhoneExists(phone)).unwrap();
        localStorage.setItem("phone",phone);

        if(result.exists){
            router.push("/home/table");
        }else{
            router.push("/menu/signup")
        }
    }
  return (
    <div className='container mx-auto'>
        <div className='flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat' style={{backgroundImage: 'url(/images/background/authback.jpg)'}}>
        <div className='bg-black p-6 rounded-lg w-96'>
            <h1 className='text-white text-xl font-semibold text-center mb-6'>Phone Number</h1>
            <input 
            type="text" 
            placeholder='Enter your phone number'
            className='w-full px-4 py-3 rounded-md text-sm bg-gray-300 text-black outline-none focus:ring-2 focus:ring-red-600 mb-6'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            />
            <button
                onClick={handleClick}
                className='w-full bg-blue-600 text-white font-medium py-3 rounded-md text-center'
                disabled={loading}
            >
                {loading ? "Checking..." :"Next"}
            </button>
        </div>
        </div>
    </div>
  )
}

export default page