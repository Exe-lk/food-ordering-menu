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
import { fetchProducts } from "@/redux/features/internalProductSlice";

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { internalFoods, loading, error, fetched } = useSelector(
    (state: RootState) => state.products
  );

  // Optionally, if you want to have a local copy:
  const [localProducts, setLocalProducts] = useState(internalFoods);

  const handleEdit = (productId: number) => {
    // Implement edit functionality here
  };

  const handleRemove = (productId: number) => {
    setSelectedProductId(productId);
    setIsConfirmOpen(true);
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
                onEdit={() => handleEdit(Number(product.id))}
                onRemove={() => handleRemove(Number(product.id))}
              />
            ))
        )}
      </div>
      <Create isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
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
