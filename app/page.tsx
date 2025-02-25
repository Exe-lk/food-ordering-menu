"use client"
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"

export default function Home() {
  const router = useRouter();

  useEffect(() =>{
    const phone = Cookies.get("phone");
    const tableNumber = Cookies.get("tableNumber");
    if(phone && tableNumber){
      router.push("/menu/home")
    }else{
      router.push('/home');
    }
  },[router])

  return null
}
