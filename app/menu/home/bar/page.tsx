"use client";
import React from "react";
import { useRouter } from "next/navigation";
import menuData from "@/data/menus";
import Menu from "@/components/MenuSide/Menu";

const Page = () => {
  const router = useRouter();

  
  const handleMenuClick = (menuName: string) => {
    router.push(`/menu/home/bar/${menuName}`);
  };

  return (
    <>
      <Menu type="Bar"/>
    </>
  );
};

export default Page;
