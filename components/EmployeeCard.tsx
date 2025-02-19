"use client"
import React from 'react'
import ActionButton from './ActionButton';

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
          <ActionButton onEdit={() => onEdit(index)} onRemove={() => onRemove(index)}/>
        </div>
      ))}
    </div>
  )
}

export default EmployeeCard
