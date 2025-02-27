"use client"
import React,{useState} from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { importInternalProduct } from '@/redux/features/internalProductSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import Sidebar from '@/components/Sidebar'
import { table } from 'console'

interface ExternalProduct {
    id: string;
    name: string;
    category: string;
    description: string;
    imageUrl: string;
    sizes: { size: string; price: string }[];
    created_at: string;
    isDeleted: boolean;
    created_by?: string;
}
  
const page = () => {
    const [apiUrl, setApiUrl] = useState("");
    const [products, setProducts] = useState<ExternalProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const [importedIds, setImportedIds] = useState<string[]>([]);

    const handleFetch = async () =>{
        if(!apiUrl){
            Swal.fire("Error","Please provide a valid API URL.","error");
            return;
        }
        try {
            setLoading(true)
            const response = await axios.get(apiUrl);
            setProducts(response.data);
            setLoading(false);
        } catch (error:any) {
            setLoading(false)
            Swal.fire("Error",error.message,"error");
        }
    };
    const handleImport = (product:ExternalProduct) =>{
        dispatch(importInternalProduct(product));
        setImportedIds((prev) => [...prev, product.id]);
        Swal.fire("Imported",`${product.name} imported successfully`,'success');
    }
  return (
    <div className='flex'>
        <Sidebar/>
        <div className='p-4 min-h-screen bg-beige ml-14 w-full'>
            <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-customGold">Menu Management</h1>
            </div>
            <div className='p-8'>
                <div className='flex items-center mb-4'>
                    <input 
                        type="text" 
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        placeholder='Paste API URL Here (Ex:http://localhost:5000/internal-products)'
                        className="flex-1 border border-gray-300 rounded-md py-2 px-4 mr-4"
                    />
                    <button
                        onClick={handleFetch}
                        className='bg-customGold text-white py-2 px-4 rounded-lg'
                    >
                        {loading ? "Fetching...":"Fetch"}
                    </button>
                </div>
                {products.length > 0 && (
                    <table className='min-w-full border border-gray-300'>
                        <thead className='bg-gray-800 text-white'>
                            <tr>
                                <th className='px-4 py-2 border-r'>Name</th>
                                <th className='px-4 py-2 border-r'>Category</th>
                                <th className='px-4 py-2 border-r'>Description</th>
                                <th className='px-4 py-2 border-r'>Image</th>
                                <th className='px-4 py-2 border-r'>Sizes</th>
                                <th className='px-4 py-2 border-r'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((prod) =>(
                                <tr key={prod.id} className='text-center border-t'>
                                    <td className='px-4 py-2 border-r'>{prod.name}</td>
                                    <td className='px-4 py-2 border-r'>{prod.category}</td>
                                    <td className='px-4 py-2 border-r'>{prod.description}</td>
                                    <td className='px-4 py-2 border-r'>
                                        <img src={prod.imageUrl} alt={prod.name} className='h-10 mx-auto' />
                                    </td>
                                    <td className='px-4 py-2 border-r'>
                                        {prod.sizes.map((s,i)=>(
                                            <div key={i}>
                                                {s.size} - {s.price}LKR
                                            </div>
                                        ))}
                                    </td>
                                    <td className='px-4 py-2'>
                                        <button
                                            onClick={() => handleImport(prod)}
                                            disabled={importedIds.includes(prod.id)}
                                            className={`py-1 px-2 rounded-md ${
                                                importedIds.includes(prod.id)
                                                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                                  : "bg-green-600 text-white hover:bg-green-700"
                                              }`}
                                        >
                                            {importedIds.includes(prod.id) ? "Imported" : "Import"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    </div>
  )
}

export default page