"use client"
import React,{useEffect, useState} from 'react'
import { MdOutlineRestore, MdDeleteOutline } from "react-icons/md";
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { fetchDeletedMenus, deleteMenu, removeMenu, Menu, restoreMenu } from '@/redux/features/menuSlice'
import { fetchDeletedPortions, deletePortion,restorePortion, Portion, fetchPortions } from '@/redux/features/portionSlice'
import { fetchDeletedProducts,deleteProduct,restoreProduct, DeletedProduct } from '@/redux/features/internalProductSlice'
import { fetchDeletedSuppliers, deleteSupplier, restoreSupplier,Supplier } from '@/redux/features/supplierSlice'
import { fetchDeletedExternalProducts, deleteExternalProduct, restoreExternalProduct, ExternalFood } from '@/redux/features/externalProductSlice'
import { fetchDeletedCategory, deleteCategory, restoreCategory } from '@/redux/features/ingredientCategorySlice'
import { fetchDeletedEmployees, deleteEmployee, restoreEmployee } from '@/redux/features/employeeSlice'
import { fetchDeletedIngredients, deleteIngredient, restoreIngredient } from '@/redux/features/ingredientsSlice'
import { MdClose } from 'react-icons/md'

interface RecycleProps{
    isOpen:boolean;
    onClose:() => void;
    recycleType: "menu" | "portion" | "internal" | "supplier" | "external" | "category" | "employee" | "ingredient"
}

type Item = Menu | Portion | DeletedProduct

const RecycleModal = ({isOpen, onClose, recycleType}:RecycleProps) => {
    const dispatch = useDispatch<any>();
    const [deletedItems, setDeletedItems] = useState<Item[]>([]);

    const actions = {
        menu:{
            fetchDeleted:fetchDeletedMenus,
            restore:restoreMenu,
            delete:deleteMenu,
            label:"menu"
        },
        portion:{
            fetchDeleted:fetchDeletedPortions,
            restore:restorePortion,
            delete:deletePortion,
            label:"portion"
        },
        internal:{
            fetchDeleted:fetchDeletedProducts,
            restore:restoreProduct,
            delete:deleteProduct,
            label:"internal"
        },
        supplier:{
          fetchDeleted:fetchDeletedSuppliers,
          restore:restoreSupplier,
          delete:deleteSupplier,
          label:"supplier"
        },
        external:{
          fetchDeleted: fetchDeletedExternalProducts,
          restore: restoreExternalProduct,
          delete: deleteExternalProduct,
          label: "external"
        },
        category:{
          fetchDeleted:fetchDeletedCategory,
          restore:restoreCategory,
          delete:deleteCategory,
          label:"category"
        },
        employee:{
          fetchDeleted:fetchDeletedEmployees,
          restore:restoreEmployee,
          delete:deleteEmployee,
          label:"employee"
        },
        ingredient:{
          fetchDeleted:fetchDeletedIngredients,
          restore:restoreIngredient,
          delete:deleteIngredient,
          label:"ingredient"
        }
    };
    const currentActions = actions[recycleType]

    
    useEffect(() => {
        if (isOpen) {
        dispatch(currentActions.fetchDeleted())
            .then((action: any) => {
            if (action.payload) {
                setDeletedItems(action.payload);
            }
            });
        }
    }, [isOpen, dispatch, currentActions]);

    const handleRestore = (id:string) =>{
        dispatch(currentActions.restore({id})).then(() => {
            setDeletedItems((prev) =>prev.filter((item)=>item.id !== id))
            if (recycleType === "portion") {
              dispatch(fetchPortions());
            }
        });
    };

    const handleDelete = (id: string) => {
        Swal.fire({
          title: "Confirm Deletion",
          text: `Please type DELETE to confirm deletion of the ${currentActions.label}.`,
          input: "text",
          inputPlaceholder: "Type DELETE here",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Delete",
          preConfirm: (value) => {
            if (value !== "DELETE") {
              Swal.showValidationMessage("You must type DELETE exactly to confirm");
            }
            return value;
          },
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(currentActions.delete({ id })).then(() => {
              Swal.fire("Deleted!", `The ${currentActions.label} has been deleted.`, "success");
              setDeletedItems((prev) => prev.filter((item) => item.id !== id));
            });
          }
        });
      };
    
      if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[500px] h-[600px] max-h-[650px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-center w-full text-black">Recycle Bin</h2>
          <button onClick={onClose} className="text-lg font-bold text-black"><MdClose/></button>
        </div>
        {deletedItems.length === 0 ? (
          <p className="text-center">No deleted {currentActions.label}s.</p>
        ) : (
          <div className="space-y-2">
            {deletedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg border border-customorange">
                <span className="text-sm font-medium text-black">{item.name}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRestore(item.id)}
                    className="bg-black text-white p-2 rounded-md w-10"
                  >
                    <MdOutlineRestore/>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white p-2 rounded-md w-10"
                  >
                    <MdDeleteOutline/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecycleModal