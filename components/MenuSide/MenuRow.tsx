import React from 'react';
import { Menu } from '@/redux/features/menuSlice'; 

interface MenuRowProps {
  menus: Menu[];
  onMenuSelect: (menu: Menu) => void;
  activeMenu: Menu | null;
  selectedMenuType: string;
}

const MenuRow: React.FC<MenuRowProps> = ({
  menus,
  onMenuSelect,
  activeMenu,
  selectedMenuType,
}) => {
  const filteredMenus = menus.filter(
    (menu) =>
      menu.menu_type?.toLowerCase() === selectedMenuType.toLowerCase()
  );

  return (
    <div className="flex space-x-4 overflow-x-scroll p-4">
      {filteredMenus.map((menu) => (
        <button
          key={menu.id}
          onClick={() => onMenuSelect(menu)}
          className={`px-4 py-2 rounded-lg font-medium w-96 whitespace-nowrap ${
            activeMenu && menu.id === activeMenu.id
              ? 'bg-customorange text-white'
              : 'bg-customBeige border border-customorange text-customGold'
          }`}
        >
          {menu.name}
        </button>
      ))}
    </div>
  );
};

export default MenuRow;
