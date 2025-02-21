import React from 'react'
import ActionButton from '../ActionButton';

interface supplier{
  name:string;
}
interface ExternalCardProps{
    category: string;
    brand: string;
    name: string;
    quantity: string;
    unit: string;
    manufactureDate: string;
    expiryDate: string;
    dateIn: string;
    costPrice: string;
    supplier: supplier[];
    description: string;
    onEdit:() => void;
    onRemove:() => void;
    onView:() => void;
}

const ExternalCard = ({category, brand, name, quantity, dateIn, costPrice, supplier, onEdit, onRemove, onView}:ExternalCardProps) => {
  const handleCardClick = () => {
      onView();
    };
    const stopPropagation = (e: React.MouseEvent) => {
      e.stopPropagation();
    };
  return (
    <div 
      onClick={handleCardClick}
      className='grid grid-cols-9 items-center border rounded-lg shadow-md p-4 mb-4 bg-white hover:bg-gray-300 transition-all duration-300 cursor-pointer'
      title="Click to view more details"
      >
        <div className='text-gray-900 font-bold items-center justify-center text-center'>
            {category}
        </div>
        <div className='text-gray-900 font-bold px-2 items-center justify-center text-center'>
            {brand}
        </div>
        <div className='text-gray-900 font-bold px-2 items-center justify-center text-center'>
            {name}
        </div>
        <div className='text-gray-900 font-bold px-2 items-center justify-center text-center'>
            {quantity}
        </div>
        <div className='text-gray-900 font-bold px-2 items-center justify-center text-center'>
            {dateIn}
        </div>
        <div className='text-gray-900 font-bold px-2 items-center justify-center text-center'>
            {costPrice}
        </div>
        <div className='text-gray-900 font-bold px-2 items-center justify-center text-center'>
            {supplier.map((sup, index) => (
              <div key={index} className='text-sm text-gray-800 text-center items-center justify-center border-l border-r border-gray-600'>
                {sup.name}
              </div>
            ))}
        </div>
        <div onClick={stopPropagation}>
        <ActionButton onEdit={onEdit} onRemove={onRemove} />
      </div>
    </div>
  )
}

export default ExternalCard