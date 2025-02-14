"use client"
import React from 'react'

interface Employee {
  name: string;
  empId: string;
  username: string;
  password: string;
  contact: string;
  role: string;
}

interface EmployeeCardProps {
  employees: Employee[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

const EmployeeCard = ({ employees, onEdit, onRemove }: EmployeeCardProps) => {
  return (
    <div className="mt-5 space-y-6">
      {employees.map((emp, index) => (
        <div
          key={index}
          className="grid grid-cols-6 items-center border rounded-lg shadow-md p-4 bg-white hover:bg-gray-100 transition-all duration-300 cursor-pointer"
        >
          <div className="text-black font-semibold text-center">{emp.name}</div>
          <div className="text-black font-semibold text-center">{emp.username}</div>
          <div className="text-black font-semibold text-center">
            {"*".repeat(emp.password.length)}
          </div>
          <div className="text-black font-semibold text-center">{emp.contact}</div>
          <div className="text-black font-semibold text-center">{emp.role}</div>
          <div className="flex space-x-2 justify-center">
            <button
              onClick={() => onEdit(index)}
              className="px-4 py-2 text-white bg-customblue hover:bg-blue-900 rounded-md shadow-lg"
            >
              Edit
            </button>
            <button
              onClick={() => onRemove(index)}
              className="px-4 py-2 text-white bg-red-800 rounded-md shadow-lg"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EmployeeCard
