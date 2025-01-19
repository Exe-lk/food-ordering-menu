import { addToCart } from '@/redux/store';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
interface PortionPopUpProps {
    name: string;
    portions: {size: string; price:string}[];
    onClose:() => void;
    image:string;
}
const PortionPopUp = ({name, portions, image, onClose}:PortionPopUpProps) => {
    const [selectedPortion, setSelectedPortion] = useState("");
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const handleAddToCart = () =>{
        if(selectedPortion){
            const price = portions.find((p) => p.size === selectedPortion)?.price || '0';
            dispatch(
                addToCart({
                    name, 
                    portion:selectedPortion, 
                    quantity, 
                    price: +price,
                    image    
                })
            );
            onClose();
        }else{
            alert("Please Select a Portion Size");
        }
    };
  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50'>
        <div className='bg-black p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-xl font-bold mb-4'>{name}</h2>
            <div className='mb-4'>
                <label htmlFor="" className='block font-bold mb-2'>Select Portion:</label>
                {portions.map((portion, index) =>(
                    <div key={index}>
                        <input 
                            type="radio"
                            id={portion.size}
                            name='portion'
                            value={portion.size}
                            onChange={(e) => setSelectedPortion(e.target.value)}
                        />
                        <label htmlFor={portion.size} className='ml-2'>
                            {portion.size} - {portion.price} LKR
                        </label>
                    </div>
                ))}
            </div>
            <div className='mb-4'>
                <label htmlFor="" className='block font-bold mb-2'>Quantity</label>
                <input 
                    type="number"
                    min="1" 
                    value={quantity}
                    onChange={(e) => setQuantity(+e.target.value)}
                    className='border p-2 w-full text-black'
                />
            </div>
            <div className='flex justify-end'>
                <button onClick={handleAddToCart} className='bg-red-500 text-white px-4 py-2 rounded mr-2'>
                    Add
                </button>
                <button onClick={onClose} className='bg-gray-800 text-white rounded'>
                    Cancel
                </button>
            </div>
        </div>
    </div>
  )
}
export default PortionPopUp