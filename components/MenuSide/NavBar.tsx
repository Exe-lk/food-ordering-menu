import Link from 'next/link'
import React from 'react'
import { FaShoppingCart } from 'react-icons/fa'

const NavBar = () => {
  return (
    <div
      className="bg-[#1b1d1b] border-t border-[#C9893C] rounded-b-xl"
    >
      <div
        className="max-w-full mx-auto px-4 py-2 flex items-center justify-between"
      >
        <div className="flex-shrink-0">
          <img
            src="/assets/logo.png"
            alt="VRTICLE by Themesan"
            className="h-8 w-auto"
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
            href="/menus"
            className="text-[#C9893C] hover:text-orange-400 transition-colors"
          >
            Menus
          </Link>
          <Link
            href="/contact"
            className="text-[#C9893C] hover:text-orange-400 transition-colors"
          >
            Contact
          </Link>
        </nav>
        <div className="text-2xl cursor-pointer text-[#C9893C] hover:text-orange-400 transition-colors">
          <FaShoppingCart />
        </div>
      </div>
    </div>
  )
}

export default NavBar
