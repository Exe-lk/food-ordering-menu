"use client"
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { fetchDeletedPortions, deletePortion, restorePortion, Portion } from "@/redux/features/portionSlice";

interface RecycleBinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PortionRecycleBin = ({ isOpen, onClose }: RecycleBinModalProps) => {
  const dispatch = useDispatch<any>();
  const [deletedPortions, setDeletedPortions] = useState<Portion[]>([]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchDeletedPortions())
        .then((action: any) => {
          if (action.payload) {
            setDeletedPortions(action.payload);
          }
        });
    }
  }, [isOpen, dispatch]);

  const handleRestore = (id: string) => {
    dispatch(restorePortion({ id }))
      .then(() => {
        setDeletedPortions((prev) => prev.filter((p) => p.id !== id));
      });
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Confirm Deletion",
      text: "Please type DELETE to confirm deletion.",
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
      }
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletePortion({ id })).then(() => {
          Swal.fire("Deleted!", "The portion has been deleted.", "success");
          setDeletedPortions((prev) => prev.filter((p) => p.id !== id));
        });
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50 text-black">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recycle Bin</h2>
          <button onClick={onClose} className="text-xl">&times;</button>
        </div>
        {deletedPortions.length === 0 ? (
          <p>No deleted portions.</p>
        ) : (
          deletedPortions.map((portion) => (
            <div key={portion.id} className="flex items-center justify-between border-b py-2">
              <div>
                <p className="font-bold">{portion.name}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRestore(portion.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Restore
                </button>
                <button
                  onClick={() => handleDelete(portion.id)}
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
  );
};

export default PortionRecycleBin;
