// Menu.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectMenu } from '@/redux/store';
import menuData from '@/data/menus';

const Menu = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Handle Menu Click
  const handleMenuClick = (name: string) => {
    dispatch(selectMenu(name));
    router.push(`/menu/home/menu/${name}`);
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen p-6">
      <h1 className="text-white text-2xl font-bold mb-4">Menus</h1>
      <hr className="border-gray-700 w-full mb-6" />
      <div className="grid grid-cols-2  gap-1 w-full max-w-sm">
        {menuData.map((item, index) => (
          <div
            key={index}
            className="relative rounded-sm overflow-hidden cursor-pointer"
            onClick={() => handleMenuClick(item.name)}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-28 object-cover brightness-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-lg font-semibold">{item.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
