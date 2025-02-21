"use client";
import React, { useState, useEffect } from "react";
import InternalMasterView from "@/components/PopUpModels/InternalMasterView";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/Button";
import TableHeading from "@/components/Headings/TableHeading";
import InternalCard from "@/components/Inventory/InternalCard";
import Create from "@/components/PopUpModels/Create";
import Confirm from "@/components/PopUpModels/Confirm";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, InternalFood, removeProduct } from "@/redux/features/internalProductSlice";
import Edit from "@/components/PopUpModels/EditPopUps/Edit";
import RecycleBinButton from "@/components/RecycleBin";
import RecycleModal from "@/components/RecycleModal";
import ProgressBar from "@/components/ProgressBar";

const Page = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InternalFood | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [isMasterViewOpen, setIsMasterViewOpen] = useState(false);

  const {menus:allmenus} = useSelector((state:RootState) => state.menuType);
  const dispatch = useDispatch<AppDispatch>();
  const { internalFoods, loading, error, fetched } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    if (!fetched) {
      dispatch(fetchProducts());
    }
  }, [fetched, dispatch]);

  const handleEdit = (productId: string) => {
    const product = internalFoods.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsEditPopupOpen(true);
    }
  };

  // Update handleRemove to use product ID
  const handleRemove = (id: string) => {
    setSelectedProductId(id);
    setIsConfirmOpen(true);
  };

  const confirmRemove = async () => {
    if (selectedProductId) {
      await dispatch(removeProduct({ id: selectedProductId }));
      setIsConfirmOpen(false);
      setSelectedProductId(null);
    }
  };
  const handleView = (product: InternalFood) => {
    setSelectedProduct(product);
    setIsMasterViewOpen(true);
  };

  const filteredProducts = internalFoods.filter((product) =>{
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesFilter = true;
    if(filterType !== "All"){
      const menu = allmenus.find(
        (m) => m.name.toLocaleLowerCase() === product.category.toLocaleLowerCase()
      );
      matchesFilter = menu? menu.menu_type === filterType : false;
    }
    return matchesSearch && matchesFilter;
  })

  return (
    <div className="flex">
      <Sidebar/>
      <div className="p-4 min-h-screen bg-beige ml-14 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-customGold">Internal Food Item Management</h1>
        <SearchBar placeholder="Search Products" onSearch={setSearchQuery} />
      </div>
      <div className="flex space-x-4 mt-4 items-start justify-start w-full mb-3">
        <Button onClick={() => setIsPopupOpen(true)} label="Create Item" variant="primary" />
      </div>
      <div className="flex space-x-4 mb-3 items-end justify-end">
      <button
          className={`px-4 py-2 rounded ${
            filterType === "All" ? "bg-customGold text-white" : "bg-transparent border border-customGold text-black"
          }`}
          onClick={() => setFilterType("All")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filterType === "Bar" ? "bg-customGold text-white" : "bg-transparent border border-customGold text-black"
          }`}
          onClick={() => setFilterType("Bar")}
        >
          Bar
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filterType === "Food" ? "bg-customGold text-white" : "bg-transparent border border-customGold text-black"
          }`}
          onClick={() => setFilterType("Food")}
        >
          Food
        </button>
      </div>
      <TableHeading headings={["Name", "Portion & Price", "Description", "Actions"]} />
      <div className="mt-4">
        {loading ?(
          <ProgressBar/>
        ): error ? (
          <p className="text-red-500">{error}</p>
        ): filteredProducts.length > 0? (
          filteredProducts.map((product) =>(
            <InternalCard
              key={product.id}
              name={product.name}
              description={product.description}
              portions={product.sizes}
              onEdit={()=> handleEdit(product.id)}
              onRemove={() => handleRemove(product.id)}
              onView={() => handleView(product)}
            />
          ))
        ):(
          <p className="text-black">
            {searchQuery ? "No Products found" : "No Products Available"}
          </p>
        )}
      </div>
      <RecycleBinButton onClick={() => setIsRecycleBinOpen(true)} />
      <Create isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      {selectedProduct && (
        <Edit
          isOpen={isEditPopupOpen}
          onClose={() => setIsEditPopupOpen(false)}
          product={selectedProduct}
        />
      )}
      <Confirm
        message="Are you sure you want to remove the product?"
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmRemove}
      />
      <RecycleModal
        isOpen={isRecycleBinOpen}
        onClose={() => setIsRecycleBinOpen(false)}
        recycleType="internal"
      />
      <InternalMasterView
        isOpen={isMasterViewOpen}
        onClose={() => setIsMasterViewOpen(false)}
        product={selectedProduct}
      />
    </div>
    </div>
  );
};

export default Page;
