"use client";
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updatePortion, fetchPortions } from "@/redux/features/portionSlice";

interface Portion {
  id: string;
  name: string;
  isDeleted: boolean;
  created_at: string;
  update_at?: string;
  serves: string;
}

interface PortionEditProps {
  isOpen: boolean;
  onClose: () => void;
  portion: Portion;
}

const PortionEdit = ({ isOpen, onClose, portion }: PortionEditProps) => {
  const dispatch = useDispatch<any>();
  const { loading } = useSelector((state: RootState) => state.portionType);
  const [portionName, setPortionName] = useState(portion.name);
  const [serves, setServes] = useState(portion.serves);

  // Update fields when a new portion is passed in.
  useEffect(() => {
    if (portion) {
      setPortionName(portion.name);
      setServes(portion.serves);
    }
  }, [portion]);

  const handleUpdate = async () => {
    // Only update if name or serves have changed
    if (portionName === portion.name && serves === portion.serves) return;

    try {
      await dispatch(
        updatePortion({ id: portion.id, updatedName: portionName, updatedServes: serves })
      ).unwrap();
      dispatch(fetchPortions());
      onClose();
    } catch (error) {
      console.error("Error updating portion:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-85">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 text-2xl"
        >
          <FiX />
        </button>
        <h2 className="text-xl font-semibold text-center mb-4 text-customblue">Edit Portion</h2>

        <div className="mb-3">
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            value={portionName}
            onChange={(e) => setPortionName(e.target.value)}
            className="w-full border rounded-md p-2 text-black"
            placeholder="Enter Portion Name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Served Persons</label>
          <div className="flex items-center border rounded-md p-2">
            <input
              type="text"
              value={serves}
              onChange={(e) => setServes(e.target.value)}
              className="w-full ml-2 outline-none text-black"
              placeholder="Served Persons"
            />
          </div>
        </div>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-customblue text-white py-2 rounded-md hover:bg-blue-900 cursor-pointer"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default PortionEdit;
