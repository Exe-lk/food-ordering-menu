"use client"
import React, { useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { updateEmployee, fetchEmployees} from '@/redux/features/employeeSlice'
interface Employee{
    id:string;
    name:string;
    username:string;
    password:string;
    contact:string;
    empId:string;
    role:string;
}

interface EmployeeEditProps{
    isOpen:boolean;
    onClose:()=>void;
    employee:Employee
}
const EmployeeEdit = ({isOpen, onClose, employee}:EmployeeEditProps) => {
    const dispatch = useDispatch<any>();
    const {loading} = useSelector((state:RootState) => state.employee)
    const [name, setName] = useState(employee.name);
    const [password, setPassword] = useState(employee.password);
    const [role, setRole] = useState(employee.role);
    const [empId, setEmpID] = useState(employee.empId)
    const [contact, setContact] = useState(employee.contact)
    const [username, setUsername] = useState(employee.username)

    useEffect(() =>{
        if(employee){
            setName(employee.name);
            setUsername(employee.username);
            setContact(employee.contact);
            setPassword(employee.password)
            setRole(employee.role)
            setEmpID(employee.empId);
        }
    },[employee]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); 
      if (
        name === employee.name &&
        username === employee.username &&
        empId === employee.empId &&
        role === employee.role &&
        password === employee.password &&
        contact === employee.contact
      ) return;
    
      try {
        await dispatch(
          updateEmployee({
            id: employee.id,
            updatedName: name,
            updatedUsername: username,
            updatedPassword: password,
            updatedContact: contact,
            updatedEmpId: empId,
            updatedRole: role,
          })
        ).unwrap();
        dispatch(fetchEmployees());
        onClose();
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    };
    


  return (
   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
         <div className="bg-white p-6 rounded-lg shadow-lg w-[450px] relative">
           {/* Header */}
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-semibold text-customGold">Update Employee</h2>
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
                   value={name}
                   onChange={(e) => setName(e.target.value)}
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
                   value={empId}
                   onChange={(e) => setEmpID(e.target.value)}
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
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
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
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded mt-1"
                   required
                 />
               </div>
   
               {/* Role Dropdown */}
               <div>
                 <label className="block text-gray-700 font-medium">Role Type</label>
                 <select
                   name="role"
                   value={role}
                   onChange={(e) => setRole(e.target.value)}
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
                   value={contact}
                   onChange={(e) => setContact(e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded mt-1"
                   required
                 />
               </div>
   
               {/* Submit Button */}
               <button
                 type="submit"
                 className="w-full bg-customGold text-white py-2 rounded hover:bg-orange-500 transition"
               >
                 Update
               </button>
             </div>
           </form>
         </div>
       </div>
  )
}

export default EmployeeEdit