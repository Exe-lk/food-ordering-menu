"use client";
import React, { useEffect, useState } from "react";
import { FiX, FiUpload, FiImage } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchPortions } from "@/redux/features/portionSlice";
import { fetchMenus } from "@/redux/features/menuSlice";
import { addProduct, clearError} from "@/redux/features/internalProductSlice";
import Swal from "sweetalert2";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Create = ({ onClose, isOpen }: ProductModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.products);
  const { menus, loading: menusLoading } = useSelector(
    (state: RootState) => state.menuType
  );
  const { portions, loading: portionsLoading } = useSelector(
    (state: RootState) => state.portionType
  );

  const [productSizes, setProductSizes] = useState([{ size: "", price: "" }]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (newProduct.image) {
      const objectUrl = URL.createObjectURL(newProduct.image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview("");
    }
  }, [newProduct.image]);

  useEffect(() => {
    dispatch(fetchPortions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMenus());
  }, [dispatch]);

  const handleAddSize = () => {
    setProductSizes([...productSizes, { size: "", price: "" }]);
  };

  const handleRemoveSize = (index: number) => {
    const updatedSizes = productSizes.filter((_, i) => i !== index);
    setProductSizes(updatedSizes);
  };

  const handleSizeChange = (index: number, key: string, value: string) => {
    const updatedSizes = productSizes.map((size, i) =>
      i === index ? { ...size, [key]: value } : size
    );
    setProductSizes(updatedSizes);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !newProduct.name.trim() ||
      !newProduct.category.trim() ||
      !newProduct.description.trim()
    ) {
      Swal.fire({
        title: "Error",
        text: "Please fill out all required fields.",
        icon: "error",
      });
      return;
    }
    for (const size of productSizes) {
      if (!size.size.trim() || !size.price.trim()) {
        Swal.fire({
          title: "Error",
          text: "Please fill out all portion and price fields.",
          icon: "error",
        });
        return;
      }
    }
    const resultAction = await dispatch(addProduct({ newProduct, productSizes }));
    if (resultAction.meta.requestStatus === "fulfilled") {
      Swal.fire({
        title: "Success",
        text: "Product created successfully!",
        icon: "success",
      });
      setNewProduct({
        name: "",
        category: "",
        description: "",
        image: null,
      });
      setProductSizes([{ size: "", price: "" }]);
      onClose();
    }else{
      Swal.fire({
        title: "Error",
        text:
          (resultAction.payload as string) ||
          "Failed to create product. Please try again.",
        icon: "error",
      });
      dispatch(clearError());
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setNewProduct((prev) => ({ ...prev, image: acceptedFiles[0] }));
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 text-black">
      
      <div className="bg-white rounded-lg shadow-lg p-10 w-[650px] max-h-[700px] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-center w-full text-customGold">
            Create Product
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
              className="border-2 border-dashed border-customorange p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-customGold">
                  Drag & Drop the Image Here....
                </p>
              ) : newProduct.image && preview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-40 mb-2 rounded-md"
                  />
                  <p className="text-gray-700">{newProduct.image.name}</p>
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
          {/* Product Name */}
          <div className="mt-3">
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
          {/* Category */}
          <div className="mt-3">
            <label className="block text-gray-700 font-medium">Category</label>
            <select
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
          {/* Portion & Price Section */}
          {productSizes.map((size, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-2 mt-3"
            >
              {/* Portion Dropdown */}
              <select
                className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={size.size}
                onChange={(e) =>
                  handleSizeChange(index, "size", e.target.value)
                }
              >
                <option value="">Select Portion</option>
                {portionsLoading ? (
                  <option value="">Loading Portions...</option>
                ) : (
                  portions.map((option) => (
                    <option key={option.id} value={option.name}>
                      {option.name} - {option.serves}
                    </option>
                  ))
                )}
              </select>
              {/* Price Input */}
              <input
                type="text"
                placeholder="Rs. 0.00"
                className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={size.price}
                onChange={(e) =>
                  handleSizeChange(index, "price", e.target.value)
                }
              />
              <div className="shrink-0">
                <button
                  type="button"
                  className="bg-customred text-white px-3 py-2 rounded-md hover:bg-red-600"
                  onClick={() => handleRemoveSize(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="justify-center items-center mt-5">
            <button
              type="button"
              className="w-[30%] mt-3 bg-customGold text-white py-2 rounded-md hover:bg-orange-500"
              onClick={handleAddSize}
            >
              + Add Portion
            </button>
          </div>
          {/* Description */}
          <div className="mt-3">
            <label className="block text-gray-700 font-medium">
              Description
            </label>
            <textarea
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            ></textarea>
          </div>
          {/* Submit Button */}
          <div className="mt-5 flex justify-center items-center">
            <button
              type="submit"
              className="bg-customGold w-[30%] text-white px-5 py-2 rounded-md hover:bg-orange-500"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
