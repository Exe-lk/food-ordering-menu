import React from 'react'

import PizzaImg from '../../../../assets/pizza.png'
import SoftDrinkImg from '../../../../assets/softdrink.png'
import BurgerImg from '../../../../assets/burger.png'
import ChineeseImg from '../../../../assets/chineese.png'
import ItalianImg from '../../../../assets/italian.png'
import DessertImg from '../../../../assets/dessert.png'

const Menu = () => {
    const items = [
        { name: "Pizzas", image: PizzaImg.src, bgColor: "bg-pink-500" },
        { name: "Soft Drinks", image: SoftDrinkImg.src, bgColor: "bg-blue-500" },
        { name: "Burgers", image: BurgerImg.src, bgColor: "bg-yellow-500" },
        { name: "Chineese", image: ChineeseImg.src, bgColor: "bg-red-500" },
        { name: "Italian", image: ItalianImg.src, bgColor: "bg-green-500" },
        { name: "Desserts", image: DessertImg.src, bgColor: "bg-orange-500" },
      ];
  return (
    <div className='grid grid-cols-2 gap-4 p-4 items-center justify-center'>
        {items.map((item, index) =>(
            <div
                key={index}
                className={`${item.bgColor} rounded-lg p-4 flex flex-col items-center`}
            >
                <img src={item.image} alt={item.name} className='w-16 h-16 mb-4' />
                <h2 className='text-white text-lg font-semibold'>{item.name}</h2>
            </div>
        ))}
    </div>
  )
}

export default Menu