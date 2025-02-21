"use client";

import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addEmployee, clearError, fetchEmployees } from "@/redux/features/employeeSlice";
import Swal from "sweetalert2";

interface EmployeeProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEmployee = ({ isOpen, onClose }: EmployeeProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    name: "",
    empId: "",
    username: "",
    password: "",
    role: "",
    contact: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (
      !formData.name ||
      !formData.empId ||
      !formData.username ||
      !formData.password ||
      !formData.role ||
      !formData.contact
    ) {
      Swal.fire({
        title: "Empty Field",
        text: "Please Fill in All the Fields",
        icon: "error",
        confirmButtonText: "Try Again",
      });
      return;
    }
  
    try {
      await dispatch(addEmployee(formData)).unwrap();
      dispatch(fetchEmployees());
      onClose();
    } catch (error: any) {
      console.error("Failed to add employee:", error);
      if (error === "Employee Already exists") {
        Swal.fire({
          title: "Employee Already Exists",
          text: "An employee with this ID already exists. Please try a different ID.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: error || "Failed to create employee.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
      dispatch(clearError());
    }
  };

  
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[450px] relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-customGold">Create Employee</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">
            <FiX />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="text-black">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium">Employee Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-gray-700 font-medium">Employee ID</label>
              <input
                type="text"
                name="empId"
                value={formData.empId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-gray-700 font-medium">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-gray-700 font-medium">Role Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              >
                <option value="" disabled>Select a role</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Waiter">Waiter</option>
                <option value="Cashier">Cashier</option>
              </select>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-gray-700 font-medium">Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-customGold text-white py-2 rounded hover:bg-orange-500 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployee;
