"use client"
import { RootState } from '@/redux/store';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa'
import { FiBarChart2 } from "react-icons/fi";
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  useEffect(() => {
    const phone = Cookies.get("phone");
    const tableNumber = Cookies.get("tableNumber");
    if (phone && tableNumber) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () =>{
    Cookies.remove("phone");
    Cookies.remove("tableNumber");
    router.push("/menu/login")
  }
  return (
    <div className="bg-customGold border-t border-white rounded-b-3xl">
      <div className="max-w-full mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex-shrink-0">
          <img
            src="/assets/logo.png"
            alt="VRTICLE by Themesan"
            className="h-10 w-14"
          />
        </div>

        <nav className="hidden md:flex space-x-8">
          <Link
            href="/home"
            className="text-white hover:text-gray-200 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-white hover:text-gray-200 transition-colors"
          >
            About
          </Link>
          <Link
            href="/menu/orders"
            className="text-white hover:text-gray-200 transition-colors"
          >
            Orders
          </Link>
          <Link
            href="/contact"
            className="text-white hover:text-gray-200 transition-colors"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          {isLoggedIn &&(
            <div
            className='text-xl cursor-pointer text-white  hover:bg-pink-700 transition-colors bg-customGold py-2 px-2 rounded-lg'
            onClick={handleLogout}
          >
            Logout
          </div>
          )}
          {/* Added "relative" to this div */}
          <div 
            className="relative text-2xl cursor-pointer text-white hover:text-gray-200 transition-colors"
            onClick={() => router.push("/menu/cart")}
          >
            <FaShoppingCart />
          </div>
          <div
            className="md:hidden text-2xl cursor-pointer text-white hover:text-gray-200 transition-colors"
            onClick={toggleMenu}
          >
            {isOpen ? <FaTimes /> : <FiBarChart2 />}
          </div>
        </div>
      </div>
      {isOpen && (
        <nav className="md:hidden bg-customGold border-t border-white">
          <ul className="flex flex-col space-y-2 px-4 py-2">
            <li>
              <Link
                href="/home"
                className="text-white hover:text-gray-200 transition-colors"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-white hover:text-gray-200 transition-colors"
                onClick={toggleMenu}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/menus"
                className="text-white hover:text-gray-200 transition-colors"
                onClick={toggleMenu}
              >
                Menus
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-white hover:text-gray-200 transition-colors"
                onClick={toggleMenu}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default NavBar;
