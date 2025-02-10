"use client"
import React,{useEffect, useState} from 'react'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { fetchDeletedMenus, deleteMenu, removeMenu, Menu, restoreMenu } from '@/redux/features/menuSlice'
import { fetchDeletedPortions, deletePortion,restorePortion, Portion } from '@/redux/features/portionSlice'
import { fetchDeletedProducts,deleteProduct,restoreProduct, DeletedProduct } from '@/redux/features/internalProductSlice'

interface RecycleProps{
    isOpen:boolean;
    onClose:() => void;
    recycleType: "menu" | "portion" | "internal"
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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 text-black">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recycle Bin</h2>
          <button onClick={onClose} className="text-xl">
            &times;
          </button>
        </div>
        {deletedItems.length === 0 ? (
          <p>No deleted {currentActions.label}s.</p>
        ) : (
          deletedItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b py-2">
              <div>
                <p className="font-bold">{item.name}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRestore(item.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Restore
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RecycleModal