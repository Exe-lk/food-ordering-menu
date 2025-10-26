"use client";

import { useParams, useRouter } from "next/navigation";
import Model3D from "@/components/Model3D";
import { useEffect, useState } from "react";

// Function to convert product name to model file name
function getModelName(productName: string): string {
  const nameToModel: { [key: string]: string } = {
    "Beef Tenderloin Greens Potatoes": "beef-tenderloin-greens-potatoes",
    "Black Bean Burgers": "black-bean-burgers",
    "Burger Onion Rings": "burger-onion-rings",
    "Burger With Garlic Mayo Ketchup Onion Jam": "burger-with-garlic-mayo-ketchup-onion-jam",
    "Glazed Pork Rice": "glazed-pork-rice",
    "Lil Cheese Pepperoni Pizza":"lil-cheese-pepperoni-pizza"
  };
  
  return nameToModel[productName] || "";
}

export default function ARPage() {
  const params = useParams();
  const router = useRouter();
  const productName = decodeURIComponent(params.name as string);
  const modelName = getModelName(productName);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Redirect if invalid product
  useEffect(() => {
    if (!modelName) {
      router.push("/menu/home");
    }
  }, [modelName, router]);

  if (!modelName) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <p className="text-white text-sm sm:text-base px-4 text-center">Product not found</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className={`absolute top-2 sm:top-4 left-2 sm:left-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg backdrop-blur-sm transition-all ${
          isMobile 
            ? 'px-2 py-1 text-l mt-8' 
            : 'px-4 py-2'
        }`}
      >
        ← {isMobile ? 'Back to Order this' : 'Back to Order this'}
      </button>

      {/* Product name overlay */}
      <div className={`absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-10 text-white font-semibold bg-black bg-opacity-50 px-2 py-1 sm:px-4 sm:py-2 rounded-lg backdrop-blur-sm text-center max-w-[90vw] ${
        isMobile ? 'text-sm' : 'text-lg'
      }`}>
        {productName}
      </div>

      {/* 3D Model */}
      <Model3D modelName={modelName} />
    </div>
  );
}

