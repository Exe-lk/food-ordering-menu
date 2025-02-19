"use client"
import React from 'react'

interface SearchBarProps{
    placeholder?: string;
    onSearch: (query:string) => void;
}

const SearchBar = ({placeholder, onSearch}:SearchBarProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        onSearch(e.target.value);
    };
  return (
    <input 
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        className='border rounded-md px-4 py-2 bg-white text-black shadow-lg border-customorange'
     />
  )
}

export default SearchBar