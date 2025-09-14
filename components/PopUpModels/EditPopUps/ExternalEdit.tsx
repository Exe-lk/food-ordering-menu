"use client"
import React, { useEffect, useState } from "react";
import { FiX, FiImage } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchMenus } from "@/redux/features/menuSlice";
import { fetchSuppliers } from "@/redux/features/supplierSlice";
import { ExternalFood, suppliers, updateProduct } from "@/redux/features/externalProductSlice";
import Swal from "sweetalert2";

interface EditProps {
  isOpen: boolean;
  onClose: () => void;
  product: ExternalFood;
}

const ExternalEdit = ({ isOpen, onClose, product }: EditProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.externalFood);
  const { menus, loading: menusLoading } = useSelector((state: RootState) => state.menuType);
  const { suppliers: supplierList, loading: suppliersLoading } = useSelector(
    (state: RootState) => state.supplier
  );

  // Initialize supplier state from product's supplier array.
  const [supplier, setSupplier] = useState<suppliers[]>(product.supplier || []);

  // Pre-populate updatedProduct with original product values.
  const [updatedProduct, setUpdatedProduct] = useState({
    name: product.name,
    brand: product.brand,
    quantity: product.quantity,
    unit: product.unit,
    manufactureDate: product.manufactureDate,
    expiryDate: product.expiryDate,
    dateIn: product.dateIn,
    costPrice: product.costPrice,
    supplier: product.supplier,
    category: product.category,
    description: product.description,
    image_url: null as File | null,
    currentImageUrl: product.image_url,
  });

  useEffect(() => {
    dispatch(fetchMenus());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const handleAddSupplier = () => {
    setSupplier([...supplier, { name: "" }]);
  };

  const removeSupplier = (index: number) => {
    const updatedSupplier = supplier.filter((_, i) => i !== index);
    setSupplier(updatedSupplier);
  };

  const handleSupplierChange = (index: number, key: string, value: string) => {
    const updatedSupplier = supplier.map((supp, i) =>
      i === index ? { ...supp, [key]: value } : supp
    );
    setSupplier(updatedSupplier);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUpdatedProduct((prev) => ({
          ...prev,
          image_url: file,
          currentImageUrl: URL.createObjectURL(file),
        }));
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !updatedProduct.name.trim() ||
      !updatedProduct.brand.trim() ||
      !updatedProduct.category.trim() ||
      !updatedProduct.manufactureDate.trim() ||
      !updatedProduct.expiryDate.trim() ||
      !updatedProduct.dateIn.trim() ||
      !updatedProduct.unit.trim() ||
      !updatedProduct.costPrice.trim() ||
      !updatedProduct.quantity.trim() ||
      !updatedProduct.description.trim()
    ) {
      Swal.fire({
        title: "Error",
        text: "Please fill out all required fields.",
        icon: "error",
      });
      return;
    }
    if (!updatedProduct.currentImageUrl) {
      Swal.fire({
        title: "Error",
        text: "Product image is required.",
        icon: "error",
      });
      return;
    }
    const validSuppliers = supplier.filter((s) => s.name.trim() !== "");
    if (validSuppliers.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Please select at least one supplier.",
        icon: "error",
      });
      return;
    }

    const resultAction = await dispatch(
      updateProduct({
        id: product.id,
        updatedProduct,
        suppliers: supplier,
      })
    );
    if (resultAction.meta.requestStatus === "fulfilled") {
      onClose();
    } else {
      Swal.fire({
        title: "Error",
        text:
          (resultAction.payload as string) ||
          "Failed to update product. Please try again.",
        icon: "error",
      });
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50 text-black">
      <div className="bg-white rounded-lg shadow-lg p-10 w-[650px] max-h-[700px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-center w-full text-customGold">
            Edit Product
          </h2>
          <button onClick={onClose} className="text-gray-500 text-2xl font-bold hover:text-gray-700">
            <FiX />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="mt-3">
            <label className="block text-gray-700 font-medium">Image</label>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-customorange p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-customGold">Drag & Drop the Image Here...</p>
              ) : updatedProduct.currentImageUrl ? (
                <div className="flex flex-col items-center">
                  <img
                    src={updatedProduct.currentImageUrl}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg mb-2"
                  />
                  <p className="text-customGold">
                    Drag & Drop to replace or click to upload a new image
                  </p>
                </div>
              ) : (
                <>
                  <FiImage className="text-gray-500 text-3xl" />
                  <p className="mt-2 text-gray-700">
                    {updatedProduct.currentImageUrl
                      ? "Current image loaded. Drag & Drop to replace or click to upload a new image"
                      : "Drag & Drop the image here"}
                  </p>
                </>
              )}
            </div>
          </div>
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 font-medium">Product Name</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={updatedProduct.name}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, name: e.target.value })
              }
            />
          </div>
          {/* Category */}
          <div className="mt-3">
            <label className="block text-gray-700 font-medium">Category</label>
            <select
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={updatedProduct.category}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {menusLoading ? (
                <option value="">Loading Categories</option>
              ) : (
                menus.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))
              )}
            </select>
          </div>
          {/* Suppliers */}
          {supplier.map((sup, index) => (
            <div key={index} className="flex items-center justify-center gap-2 mt-3">
              <select
                className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={sup.name}
                onChange={(e) => handleSupplierChange(index, "name", e.target.value)}
              >
                <option value="">Select Supplier</option>
                {suppliersLoading ? (
                  <option value="">Loading Suppliers</option>
                ) : (
                  supplierList.map((option) => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))
                )}
              </select>
              <div className="shrink-0">
                <button
                  type="button"
                  className="bg-customred text-white px-3 py-2 rounded-md hover:bg-red-800 cursor-pointer"
                  onClick={() => removeSupplier(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="justify-center items-center mt-5">
            <button
              type="button"
              className="w-[30%] mt-3 bg-customGold text-white py-2 rounded-md hover:bg-orange-500 cursor-pointer"
              onClick={handleAddSupplier}
            >
              + Add Supplier
            </button>
          </div>
          {/* Price and Quantity */}
          <div className="flex space-x-4 mt-4 mb-4 justify-center w-full">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">Price</label>
              <div className="relative flex items-center border rounded-md px-3 py-2 bg-gray-100 shadow-sm">
                <span className="text-gray-500 mr-2">Rs.</span>
                <input
                  type="number"
                  className="w-full bg-transparent focus:outline-none text-gray-700"
                  placeholder="0.00"
                  value={updatedProduct.costPrice}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, costPrice: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">Quantity</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                value={updatedProduct.quantity}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, quantity: e.target.value })
                }
              />
            </div>
          </div>
          {/* Dates */}
          <div className="flex space-x-4 mt-4 mb-4 justify-center items-center">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">Manufacture Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={updatedProduct.manufactureDate}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, manufactureDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">Expire Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={updatedProduct.expiryDate}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, expiryDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">Date In</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={updatedProduct.dateIn}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, dateIn: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium">Description</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={updatedProduct.description}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, description: e.target.value })
              }
            />
          </div>
          <div className="mt-5 flex justify-center items-center">
            <button
              className="bg-customGold w-[30%] text-white px-5 py-2 rounded-md hover:bg-orange-500"
              type="submit"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExternalEdit;
