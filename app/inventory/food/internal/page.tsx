"use client";
import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/Button";
import TableHeading from "@/components/Headings/TableHeading";
import InternalCard from "@/components/Inventory/InternalCard";
import Create from "@/components/PopUpModels/Create";
import Confirm from "@/components/PopUpModels/Confirm";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, InternalFood } from "@/redux/features/internalProductSlice";
import Edit from "@/components/PopUpModels/EditPopUps/Edit";

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
 
  const [selectedProduct, setSelectedProduct] = useState<InternalFood | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { internalFoods, loading, error, fetched } = useSelector(
    (state: RootState) => state.products
  );


  const [localProducts, setLocalProducts] = useState(internalFoods);

  const handleEdit = (productId: string) => {
    const product = internalFoods.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsEditPopupOpen(true);
    }
  };

  const handleRemove = (productId: number) => {
  };

  useEffect(() => {
    if (!fetched) {
      dispatch(fetchProducts());
    }
  }, [fetched, dispatch]);

  useEffect(() => {
    if (internalFoods.length > 0) {
      setLocalProducts(internalFoods);
    }
  }, [internalFoods]);

  const confirmRemove = () => {
    // Implement product removal functionality
  };

  return (
    <div className="p-4 min-h-screen bg-beige">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setIsSidebarOpen(true)} className="text-2xl text-customblue">
          <FiMenu />
        </button>
        <h1 className="text-3xl font-bold text-customblue">Internal Food Item Management</h1>
        <SearchBar placeholder="Search Products" onSearch={setSearchQuery} />
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex space-x-4 mt-4 items-start justify-start w-full mb-3">
        <Button onClick={() => setIsPopupOpen(true)} label="Create Item" variant="primary" />
      </div>
      <TableHeading headings={["Name", "Portion & Price", "Description", "Actions"]} />
      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          internalFoods
            .filter((product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((product) => (
              <InternalCard
                key={product.id}
                name={product.name}
                description={product.description}
                portions={product.sizes}
                onEdit={() => handleEdit(product.id)}
                onRemove={() => handleRemove(Number(product.id))}
              />
            ))
        )}
      </div>
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
    </div>
  );
};

export default Page;
