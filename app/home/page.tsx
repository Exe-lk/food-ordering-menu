import NavBar from '@/components/MenuSide/NavBar'
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div>
        <NavBar/>
        <section className="relative bg-white z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-12 z-10">
            {/* Image Section */}
            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full overflow-hidden  z-10 mt-24">
            <img
                src="/assets/plate.png"
                alt="Delicious Food"
                className='object-cover w-full h-full '
            />
            </div>

            {/* Text Section */}
            <div className="text-center md:text-left md:ml-12 z-10">
            <h2 className="text-3xl font-bold text-black">
                Order Your <br />
                <span className="text-gray-900">Favourite Foods</span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-md">
                Fresh and tasty seafood curry sit amet, consectetur Curabitur
                accumsan auctor pulvinar protin <strong>sit amet.</strong>
            </p>

            {/* Button */}
            <div className="mt-5">
                <button className="bg-[#C47A4D] text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-md hover:bg-[#a9643c] transition">
                Order Now
                <span className="text-white text-xl">➜</span>
                </button>
            </div>
            </div>
        </div>

        {/* Bottom Curve */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-black rounded-t-[50%]"></div>
    </section>
    </div>
  )
}

export default page