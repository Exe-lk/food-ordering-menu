"use client"
import { RootState } from '@/redux/store';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa'
import { FiBarChart2 } from "react-icons/fi";
import { useSelector } from 'react-redux';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const cartCount = useSelector((state: RootState) => state.cart.totalItems);

  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  return (
    <div className="bg-[#1b1d1b] border-t border-[#C9893C] rounded-b-3xl">
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
            className="text-[#C9893C] hover:text-orange-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-[#C9893C] hover:text-orange-400 transition-colors"
          >
            About
          </Link>
          <Link
            href="/menu/orders"
            className="text-[#C9893C] hover:text-orange-400 transition-colors"
          >
            Orders
          </Link>
          <Link
            href="/contact"
            className="text-[#C9893C] hover:text-orange-400 transition-colors"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          {/* Added "relative" to this div */}
          <div 
            className="relative text-2xl cursor-pointer text-[#C9893C] hover:text-orange-400 transition-colors"
            onClick={() => router.push("/menu/cart")}
          >
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          <div
            className="md:hidden text-2xl cursor-pointer text-[#C9893C] hover:text-orange-400 transition-colors"
            onClick={toggleMenu}
          >
            {isOpen ? <FaTimes /> : <FiBarChart2 />}
          </div>
        </div>
      </div>
      {isOpen && (
        <nav className="md:hidden bg-[#1b1d1b] border-t border-[#C9893C]">
          <ul className="flex flex-col space-y-2 px-4 py-2">
            <li>
              <Link
                href="/home"
                className="text-[#C9893C] hover:text-orange-400 transition-colors"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-[#C9893C] hover:text-orange-400 transition-colors"
                onClick={toggleMenu}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/menus"
                className="text-[#C9893C] hover:text-orange-400 transition-colors"
                onClick={toggleMenu}
              >
                Menus
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-[#C9893C] hover:text-orange-400 transition-colors"
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
