import React from 'react'

interface CategoryRowProps {
    categories:string[];
}

const CategoryRow = ({categories}:CategoryRowProps) => {
  return (
    <div className='flex space-x-4 overflow-x-scroll p-4'>
        {categories.map((category, index) =>(
            <button 
                key={index}
                className='px-4 py-2 bg-customback rounded-full font-medium text-black'
            >
                {category}
            </button>
        ))}

    </div>
  )
}

export default CategoryRow