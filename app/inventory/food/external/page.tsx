"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/Button";
import ExternalCard from "@/components/Inventory/ExternalCard";
import ExternalHeading from "@/components/Headings/ExternalHeading";
import External from "@/components/PopUpModels/External";
import { ExternalFood, fetchProducts, removeProduct } from "@/redux/features/externalProductSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import RecycleBinButton from "@/components/RecycleBin";
import ExternalEdit from "@/components/PopUpModels/EditPopUps/ExternalEdit";
import Confirm from "@/components/PopUpModels/Confirm";
import RecycleModal from "@/components/RecycleModal";
import ProgressBar from "@/components/ProgressBar";
import ExternalMasterView from "@/components/PopUpModels/ExternalMasterView";

const Page = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ExternalFood | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [isMasterViewOpen, setIsMasterViewOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const { externalFoods, loading, error, fetched } = useSelector(
    (state: RootState) => state.externalFood
  );

  // Fetch products if not already fetched
  useEffect(() => {
    if (!fetched) {
      dispatch(fetchProducts());
    }
  }, [fetched, dispatch]);

  // Once loading is false and products are fetched, hide the full-page loader
  useEffect(() => {
    if (!loading && fetched) {
      setIsPageLoading(false);
    }
  }, [loading, fetched]);

  const handleEdit = (productId: string) => {
    const product = externalFoods.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsEditPopupOpen(true);
    }
  };

  const handleRemove = (id: string) => {
    setSelectedProductId(id);
    setIsConfirmOpen(true);
  };

  const handleView = (product: ExternalFood) => {
    setSelectedProduct(product);
    setIsMasterViewOpen(true);
  };

  const confirmRemove = async () => {
    if (selectedProductId) {
      await dispatch(removeProduct({ id: selectedProductId }));
      setIsConfirmOpen(false);
      setSelectedProductId(null);
    }
  };

  // If the page is still loading, display a full-screen spinner
  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-beige">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-customGold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 h-screen bg-beige ml-14 w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-customGold">
            External Food Item Management
          </h1>
          <SearchBar placeholder="Search Products" onSearch={setSearchQuery} />
        </div>
        <div className="flex space-x-4 mt-4 items-start justify-start w-full mb-3">
          <Button onClick={() => setIsPopupOpen(true)} label="Create Item" variant="primary" />
        </div>
        <ExternalHeading />
        <div className="mt-4">
          {loading ? (
            // You can still show an inline spinner if needed:
            <ProgressBar />
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            externalFoods
              .filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((product) => (
                <ExternalCard
                  key={product.id}
                  category={product.category}
                  brand={product.brand}
                  name={product.name}
                  quantity={product.quantity}
                  dateIn={product.dateIn}
                  costPrice={product.costPrice}
                  supplier={product.supplier}
                  manufactureDate={product.manufactureDate}
                  expiryDate={product.expiryDate}
                  unit={product.unit}
                  description={product.description}
                  onEdit={() => handleEdit(product.id)}
                  onRemove={() => handleRemove(product.id)}
                  onView={() => handleView(product)}
                />
              ))
          )}
        </div>
        <RecycleBinButton onClick={() => setIsRecycleBinOpen(true)} />
        <External isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
        {selectedProduct && (
          <ExternalEdit
            isOpen={isEditPopupOpen}
            onClose={() => setIsEditPopupOpen(false)}
            product={selectedProduct}
          />
        )}
        <Confirm
          message="Are you sure you want to remove this product?"
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmRemove}
        />
        <RecycleModal
          isOpen={isRecycleBinOpen}
          onClose={() => setIsRecycleBinOpen(false)}
          recycleType="external"
        />
        <ExternalMasterView
          isOpen={isMasterViewOpen}
          onClose={() => setIsMasterViewOpen(false)}
          product={selectedProduct}
        />
      </div>
    </div>
  );
};

export default Page;
