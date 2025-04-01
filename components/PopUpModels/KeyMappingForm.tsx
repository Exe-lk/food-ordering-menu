"use client"
import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

interface KeyMappingFormProps {
    isOpen: boolean;
    expectedKeys: string[];
    incomingKeys: string[];
    onSubmit: (mapping: { [expectedKey: string]: string }) => void;
    onClose: () => void;
}

const KeyMappingForm = ({isOpen, expectedKeys, incomingKeys,onSubmit,onClose}:KeyMappingFormProps) => {
    const [mapping, setMapping] = useState<{[key:string]:string}>({});
    useEffect(() => {
        const initialMapping: { [key: string]: string } = {};
        expectedKeys.forEach((key) => {
          initialMapping[key] = incomingKeys[0] || "";
        });
        setMapping(initialMapping);
    }, [expectedKeys, incomingKeys]);

    if (!isOpen) return null;

    const handleChange = (expectedKey:string, value:string) =>{
        setMapping((prev) =>({
            ...prev,
            [expectedKey]:value
        }));
    };

    const handleSubmit = (e:React.FormEvent) =>{
        e.preventDefault();
        onSubmit(mapping)
    }
    
  return (
    <div className='fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 text-black'>
        <div className='bg-white rounded-lg shadow-lg p-10 w-[650px] max-h-[700px] overflow-y-auto'>
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-700 text-2xl">
                <FiX/>
            </button>
            <h2 className='text-xl font-semibold text-center mb-4 text-customGold'>Map API Response Keys</h2>
            <form onSubmit={handleSubmit}>
                {expectedKeys.map((expectedKey) =>(
                    <div key={expectedKey} className='mb-4'>
                        <label htmlFor="expectedKeys" className='block text-gray-700 font-medium mb-1'>
                            {expectedKey}
                        </label>
                        <select 
                            value={mapping[expectedKey]}
                            onChange={(e) => handleChange(expectedKey, e.target.value)}
                            className='w-full border rounded-md p-2 text-black'
                            name="incomingKeys" 
                            id="incomingKeys"
                        >
                            {incomingKeys.map((incomingKey) =>(
                                <option key={incomingKey} value={incomingKey}>
                                    {incomingKey}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
                <button
                    type='submit'
                    className='w-full bg-customGold text-white py-2 rounded-md hover:bg-orange-600 cursor-pointer'
                >
                    Submit
                </button>
            </form>
        </div>
    </div>
  )
}

export default KeyMappingForm