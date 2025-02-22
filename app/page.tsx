"use client"
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() =>{
    router.push('/home');
  },[router])

  return null
}
