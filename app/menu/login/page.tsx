"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkPhoneExists } from '@/redux/features/customerSlice'
import { RootState } from '@/redux/store'
import Swal from 'sweetalert2'
import NavBar from '@/components/MenuSide/NavBar'
import Cookies from 'js-cookie'

const page = () => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const [phone, setPhone] = useState("");
  const { exists, loading } = useSelector((state: RootState) => state.customer);

  const isValidPhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleClick = async () => {
    if (!phone) {
      Swal.fire({
        title: "Empty Input",
        text: "Please Enter a Phone Number",
        icon: "error",
        confirmButtonText: "Okay"
      });
      return;
    }
    if (!isValidPhoneNumber(phone)) {
      Swal.fire({
        title: "Invalid Input",
        text: "Please Enter a Valid Phone Number",
        icon: 'error',
        confirmButtonText: "Okay"
      });
      return; 
    }

    const result = await dispatch(checkPhoneExists(phone)).unwrap();
    localStorage.setItem("phone", phone);
    localStorage.setItem("phoneNumber", phone);
    Cookies.set("phone",phone,{expires:1});

    if (result.exists) {
      router.push("/menu/table");
    } else {
      router.push("/menu/signup");
    }
  }

  return (
    <div>
      <NavBar/>
      <section className="relative bg-white min-h-screen">
        <div className='container mx-auto flex flex-col xl:flex-row items-center justify-evenly px-6 md:px-12 py-12 z-10 bg-white'>
          <div className="relative w-full h-96 md:w-[500px] md:h-[500px] rounded-full overflow-hidden z-10 mt-24 order-last xl:order-first">
              <img
                src="/assets/plate.jpg"
                alt="Delicious Food"
                className="object-cover w-full h-full"
              />
          </div>
            <div className='bg-beige p-6 rounded-lg w-full xl:w-[30%] z-20 mt-20 md:mt-0'>
              <h1 className='text-customGold text-xl font-semibold text-center mb-6'>Phone Number</h1>
              <input
                type="text"
                placeholder='Enter your phone number'
                className='w-full px-4 py-3 rounded-md text-sm bg-white text-black border border-customGold focus:ring-2 focus:ring-offset-customGold mb-6'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button
                onClick={handleClick}
                className='w-full bg-customGold text-white font-medium py-3 rounded-md text-center'
                disabled={loading}
              >
                {loading ? "Checking..." : "Next"}
              </button>
            </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-white rounded-t-[50%]"></div>
      </section>
    </div>
  );
}

export default page;
