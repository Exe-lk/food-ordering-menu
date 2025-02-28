"use client";
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { importInternalProduct } from "@/redux/features/internalProductSlice";
import { importExternalProduct } from "@/redux/features/externalProductSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Sidebar from "@/components/Sidebar";
import { FiHelpCircle } from "react-icons/fi";
import KeyMappingForm from "@/components/PopUpModels/KeyMappingForm";
import ImportHelp from "@/components/PopUpModels/ImportHelp";

export interface InternalProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  sizes: { size: string; price: string }[];
  created_at: string;
  isDeleted: boolean;
  created_by?: string;
  overrideImage?: File;
}

export interface ExternalFood {
  id: string;
  name: string;
  brand: string;
  category: string;
  manufactureDate: string;
  expiryDate: string;
  dateIn: string;
  supplier: { name: string }[];
  description: string;
  unit: string;
  costPrice: string;
  quantity: string;
  image_url: string;
  created_at: string;
  isDeleted: boolean;
  created_by?: string;
  overrideImage?: File;
}

export type Product = InternalProduct | ExternalFood;

const Page = () => {
  const [apiUrl, setApiUrl] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [productType, setProductType] = useState<"internal" | "external" | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [importedIds, setImportedIds] = useState<string[]>([]);
  const [importingIds, setImportingIds] = useState<string[]>([]);
  const [showMappingForm, setShowMappingForm] = useState(false);
  const [expectedKeys, setExpectedKeys] = useState<string[]>([]);
  const [incomingKeys, setIncomingKeys] = useState<string[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [isHelpOpen, setIsHelOpen] = useState(false);

  const handleFetch = async () => {
    if (!apiUrl) {
      Swal.fire("Error", "Please provide a valid API URL.", "error");
      return;
    }

    const { value: selectedType } = await Swal.fire({
      title: "Select Product Type",
      text: "Are you fetching internal or external products?",
      input: "radio",
      inputOptions: {
        internal: "Internal",
        external: "External",
      },
      inputValue: "internal",
      showCancelButton: true,
      confirmButtonText: "OK",
    });
    if (!selectedType) {
      Swal.fire("Cancelled", "Fetch cancelled", "info");
      return;
    }
    setProductType(selectedType);
    try {
      setLoading(true);
      const response = await axios.get(apiUrl);
      setLoading(false);
      const data = response.data
      setRawData(data);
      if(Array.isArray(data) && data.length >0){
        const expected =
          selectedType === "internal"
            ? [
                "id",
                "name",
                "category",
                "description",
                "imageUrl",
                "sizes",
                "created_at",
                "isDeleted",
                "created_by",
              ]
            : [
                "id",
                "name",
                "brand",
                "category",
                "manufactureDate",
                "expiryDate",
                "dateIn",
                "supplier",
                "description",
                "unit",
                "costPrice",
                "quantity",
                "image_url",
                "created_at",
                "isDeleted",
                "created_by",
              ];
          const incoming = Object.keys(data[0]);
          setIncomingKeys(incoming);
          setExpectedKeys(expected);
          const missingKeys = expected.filter((key) =>!incoming.includes(key))
          if(missingKeys.length > 0){
            setShowMappingForm(true);
          }else{
            setProducts(data);
          }
      }
  
    } catch (error: any) {
      setLoading(false);
      Swal.fire("Error", error.message, "error");
    }
  };
  
  const handleMappingSubmit = (mapping: {[expectedKey:string]:string}) =>{
    const mappedData = rawData.map((item) =>{
      const newItem:any = {};
      expectedKeys.forEach((expectedKey)=>{
        newItem[expectedKey] = item[mapping[expectedKey]];
      });
      return newItem;
    });
    setProducts(mappedData);
    setShowMappingForm(false)
  }

  const handleImport = async (product: Product) => {
    setImportingIds((prev) => [...prev, product.id]);
    try {
      if (productType === "internal") {
        await dispatch(importInternalProduct(product as InternalProduct)).unwrap();
      } else if (productType === "external") {
        await dispatch(importExternalProduct(product as ExternalFood)).unwrap();
      } else {
        Swal.fire("Error", "Please choose a product type first", "error");
        return;
      }
      setImportedIds((prev) => [...prev, product.id]);
      Swal.fire("Imported", `${product.name} imported successfully`, "success");
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setImportingIds((prev) => prev.filter((id) => id !== product.id));
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 min-h-screen bg-beige ml-14 w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-customGold">Import Existing Data</h1>
          <button 
          title="Click view impot guide"
          onClick={()=>setIsHelOpen(true)}
          className="bg-customGold  text-white w-24 flex flex-row gap-2 px-4 py-2 text-lg rounded-lg items-center justify-center text-center cursor-help"
          >
           Help <FiHelpCircle size={24}/>
          </button>
        </div>
        <div className="p-8">
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="Paste API URL Here"
              className="flex-1 border border-gray-300 rounded-md py-2 px-4 mr-4"
            />
            <button
              onClick={handleFetch}
              className="bg-customGold text-white py-2 px-4 rounded-lg"
            >
              {loading ? "Fetching..." : "Fetch"}
            </button>
          </div>
          {products.length > 0 && (
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-2 border-r">Name</th>
                  <th className="px-4 py-2 border-r">Category</th>
                  <th className="px-4 py-2 border-r">Description</th>
                  <th className="px-4 py-2 border-r">Image</th>
                  {productType === "internal" && (
                    <th className="px-4 py-2 border-r">Sizes</th>
                  )}
                  <th className="px-4 py-2 border-r">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id} className="text-center border-t">
                    <td className="px-4 py-2 border-r">{prod.name}</td>
                    <td className="px-4 py-2 border-r">{prod.category}</td>
                    <td className="px-4 py-2 border-r">{prod.description}</td>
                    <td className="px-4 py-2 border-r">
                      <img
                        src={
                          productType === "internal"
                            ? (prod as InternalProduct).imageUrl
                            : (prod as ExternalFood).image_url
                        }
                        alt={prod.name}
                        className="h-10 mx-auto"
                      />
                    </td>
                    {productType === "internal" && (
                      <td className="px-4 py-2 border-r">
                        {(prod as InternalProduct).sizes?.map((s, i) => (
                          <div key={i}>
                            {s.size} - {s.price} LKR
                          </div>
                        ))}
                      </td>
                    )}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleImport(prod)}
                        disabled={
                          importedIds.includes(prod.id) || importingIds.includes(prod.id)
                        }
                        className={`py-1 px-2 rounded-md ${
                          importedIds.includes(prod.id)
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {importedIds.includes(prod.id)
                          ? "Imported"
                          : importingIds.includes(prod.id)
                          ? "Importing..."
                          : "Import"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {showMappingForm && (
        <KeyMappingForm
          isOpen={showMappingForm}
          expectedKeys={expectedKeys}
          incomingKeys={incomingKeys}
          onSubmit={handleMappingSubmit}
          onClose={() => setShowMappingForm(false)}
        />
      )}
      <ImportHelp
      isOpen={isHelpOpen}
      onClose={()=> setIsHelOpen(false)}
      />
    </div>
  );
};

export default Page;
