"use client"

import React, { useEffect, useState } from "react";
import { FiX, FiUpload } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchMenus } from "@/redux/features/menuSlice";
import { addProduct } from "@/redux/features/externalProductSlice";
import { fetchSuppliers } from "@/redux/features/supplierSlice";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const External = ({ onClose, isOpen }: ProductModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.externalFood);
  const { menus, loading: menusLoading } = useSelector(
    (state: RootState) => state.menuType
  );
  const { suppliers, loading: suppliersLoading } = useSelector(
    (state: RootState) => state.supplier
  );

  const [supplier, setSupplier] = useState([{ name: "" }]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    category: "",
    manufactureDate: "",
    expiryDate: "",
    dateIn: "",
    supplier: "",
    description: "",
    unit: "",
    costPrice: "",
    quantity: "",
    image_url: null as File | null,
  });

  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (newProduct.image_url) {
      const objectUrl = URL.createObjectURL(newProduct.image_url);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview("");
    }
  }, [newProduct.image_url]);

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
        setNewProduct((prev) => ({ ...prev, image_url: acceptedFiles[0] }));
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resultAction = await dispatch(addProduct({ newProduct, suppliers: supplier }))
    if (resultAction.meta.requestStatus === "fulfilled") {
      setNewProduct({
        name: "",
        brand: "",
        category: "",
        manufactureDate: "",
        expiryDate: "",
        dateIn: "",
        supplier: "",
        description: "",
        unit: "",
        costPrice: "",
        quantity: "",
        image_url: null,
      });
      setSupplier([{ name: "" }]);
      onClose();
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center z-50 text-black">
      <div className="bg-white rounded-lg shadow-lg p-10 w-[650px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-center w-full">
            Create External Food Item
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 text-2xl font-bold hover:text-gray-700"
          >
            <FiX />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-3">
            <label className="block text-gray-700 font-medium">Image</label>
            <div
              {...getRootProps()}
              className="border-2 border-gray-500 bg-gray-300 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-customblue">
                  Drag & Drop the Image Here....
                </p>
              ) : newProduct.image_url && preview ? (
                <div className="flex flex-col items-center">
                  <img src={preview} alt="Preview" />
                  <p className="mt-2 text-gray-700">{newProduct.image_url.name}</p>
                </div>
              ) : (
                <>
                  <FiUpload className="text-gray-500 text-3xl" />
                  <p className="mt-2 text-gray-700">
                    Drag & Drop or Click to Upload
                  </p>
                </>
              )}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Product Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Product Brand
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={newProduct.brand}
              onChange={(e) =>
                setNewProduct({ ...newProduct, brand: e.target.value })
              }
            />
          </div>
          {/* New Unit Input */}
          <div>
            <label className="block text-gray-700 font-medium">
              Unit
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={newProduct.unit}
              onChange={(e) =>
                setNewProduct({ ...newProduct, unit: e.target.value })
              }
              placeholder="Enter Unit (e.g., kg, pcs, liter)"
            />
          </div>
          <div className="mt-3">
            <label className="block text-gray-700 font-medium">Category</label>
            <select
              name="menu"
              id="menu"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
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
          {supplier.map((supp, index) => (
            <div key={index} className="flex items-center justify-center gap-2 my-3">
              <select
                name="supplier"
                id="supplier"
                className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={supp.name}
                onChange={(e) => handleSupplierChange(index, "name", e.target.value)}
              >
                <option value="">Select Supplier/s</option>
                {suppliersLoading ? (
                  <option value="">Loading Suppliers...</option>
                ) : (
                  suppliers.map((option) => (
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
              className="w-[30%] mt-3 bg-customblue text-white py-2 rounded-md hover:bg-blue-800 cursor-pointer"
              onClick={handleAddSupplier}
            >
              + Add Supplier
            </button>
          </div>
          <div className="flex space-x-4 mt-4 mb-4 justify-center w-full">
            {/* Price Input */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">Price</label>
              <div className="relative flex items-center border rounded-md px-3 py-2 bg-gray-100 shadow-sm">
                <span className="text-gray-500 mr-2">Rs.</span>
                <input
                  type="text"
                  className="w-full bg-transparent focus:outline-none text-gray-700"
                  placeholder="0.00"
                  value={newProduct.costPrice}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, costPrice: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Quantity Input */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">Quantity</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                value={newProduct.quantity}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, quantity: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex space-x-4 mt-4 mb-4 justify-center items-center">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">Manufacture Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProduct.manufactureDate}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, manufactureDate: e.target.value })
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
                  value={newProduct.expiryDate}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, expiryDate: e.target.value })
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
                  value={newProduct.dateIn}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, dateIn: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Description</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
          </div>
          <div className="mt-5 flex justify-center items-center">
            <button
              className="bg-customblue w-[30%] text-white px-5 py-2 rounded-md hover:bg-blue-800"
              type="submit"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default External;
