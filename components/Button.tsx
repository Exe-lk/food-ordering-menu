import { useRouter } from 'next/navigation';
import React from 'react'

interface ButtonProps {
    label?: string;
    link?: string;
    onClick?: () => void;
    variant: "primary" | "secondary";
}

const Button = ({label, link, onClick, variant}:ButtonProps) => {
    const router = useRouter();

    const handleClick = () =>{
        if(link){
            router.push(link)
        }else if(onClick){
            onClick();
        }
    }
  return (
    <button
    className={`px-6 py-2 rounded-lg font-semibold ${
      variant === "primary"
        ? "bg-customblue text-white"
        : "border border-black bg-white text-black"
    }`}
    onClick={handleClick}
  >
    {label}
  </button>
  )
}

export default Button