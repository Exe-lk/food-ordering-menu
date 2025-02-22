import React from 'react'

interface MenuRowProps {
  menus: string[]
  onMenuSelect: (menu: string) => void
  activeMenu: string
}

const MenuRow = ({ menus, onMenuSelect, activeMenu }: MenuRowProps) => {
  return (
    <div className="flex space-x-4 overflow-x-scroll p-4">
      {menus.map((menu, index) => (
        <button
          key={index}
          onClick={() => onMenuSelect(menu)}
          className={`px-4 py-2 rounded-lg font-medium  w-96 whitespace-nowrap ${
            menu === activeMenu ? 'bg-customorange text-white' : 'bg-customBeige border border-customorange text-customGold'
          }`}
        >
          {menu}
        </button>
      ))}
    </div>
  )
}

export default MenuRow
