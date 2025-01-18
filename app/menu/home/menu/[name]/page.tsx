"use client"
import { useParams } from "next/navigation";
import { products } from "@/data/products";
import CategoryRow from "../../_components/CategoryRow";
import ProductCard from "../../_components/ProductCard";
import { FiMenu } from "react-icons/fi";
import CartSection from "../_components/CartSection";

const MenuPage = () => {
  const params = useParams();
  const selectedMenu = params.name as string;
  const menuProducts = products[selectedMenu];

  if (!menuProducts) {
    return <div className="p-4">No products found for this menu.</div>;
  }

  return (
    <div className="p-2 bg-cover bg-center bg-no-repeat" style={{backgroundImage:'url(/images/background/menuback.png)'}}>
      <header className="flex justify-between items-center mb-4 border-b-2 border-white">
        <h1 className="text-3xl font-bold">{selectedMenu}</h1>
        <button className="bg-transparent p-2 rounded"><FiMenu size={24}/></button>
      </header>
      <CategoryRow categories={["Pasta", "Spaghetti", "Pizza", "Risotto"]} />
      <div>
        {menuProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
      <CartSection/>
    </div>
  );
};

export default MenuPage;