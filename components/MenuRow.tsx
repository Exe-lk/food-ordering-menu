import React from 'react'

interface MenuRowProps {
    menus:string[];
    onMenuSelect:(menu:string) => void;

}

const MenuRow = ({menus, onMenuSelect}:MenuRowProps) => {
  return (
    <div className='flex space-x-4 overflow-x-scroll p-4'>
        {menus.map((menu, index) =>(
            <button 
                key={index}
                onClick={() => onMenuSelect(menu)}
                className='px-4 py-2 bg-customback rounded-full font-medium text-black w-96 whitespace-nowrap'
            >
                {menu}
            </button>
        ))}

    </div>
  )
}

export default MenuRow