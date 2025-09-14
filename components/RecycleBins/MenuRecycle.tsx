"use client"
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { fetchDeletedMenus, deleteMenu, restoreMenu, Menu } from "@/redux/features/menuSlice";

interface RecycleBinModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

const MenuRecycle = ({isOpen, onClose}:RecycleBinModalProps) => {
    const dispatch = useDispatch<any>();
    const [deletedMenus, setDeletedMenus] = useState<Menu[]>([]);

    useEffect(() => {
        if(isOpen){
            dispatch(fetchDeletedMenus())
            .then((action:any) =>{
                if(action.payload){
                    setDeletedMenus(action.payload)
                }
            });
        }
    }, [isOpen, dispatch])

    const handleRestore = (id:string) =>{
        dispatch(restoreMenu({id}))
        .then(() =>{
            setDeletedMenus((prev) => prev.filter((p) => p.id !== id))
        });
    };

    const handleDelete = (id:string) =>{
        Swal.fire({
            title:"Confirm Deletion",
            text:"Please Type 'DELETE' to confirm Deletion",
            input:'text',
            inputPlaceholder:"Type DELETE here",
            showCancelButton:true,
            confirmButtonColor:"#d33",
            cancelButtonColor:"#3085d6",
            confirmButtonText:"DELETE",
            preConfirm: (value) => {
                if (value !== "DELETE") {
                    Swal.showValidationMessage("You must type DELETE exactly to confirm");
                }
                return value;
            }
        }).then((result) =>{
            if(result.isConfirmed){
                dispatch(deleteMenu({id})).then(() =>{
                    Swal.fire('Deleted!', "The Menu has been deleted",'success');
                    setDeletedMenus((prev) => prev.filter((p) => p.id !== id));
                });
            }
        });
    };
    if(!isOpen) return null 
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50 text-black">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recycle Bin</h2>
          <button onClick={onClose} className="text-xl">&times;</button>
        </div>
        {deletedMenus.length === 0 ? (
          <p>No deleted portions.</p>
        ) : (
          deletedMenus.map((menus) => (
            <div key={menus.id} className="flex items-center justify-between border-b py-2">
              <div>
                <p className="font-bold">{menus.name}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRestore(menus.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Restore
                </button>
                <button
                  onClick={() => handleDelete(menus.id)}
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

export default MenuRecycle