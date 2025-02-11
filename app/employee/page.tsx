"use client"
import Button from '@/components/Button';
import EmployeeHeading from '@/components/Headings/EmployeeHeading';
import SearchBar from '@/components/SearchBar';
import Sidebar from '@/components/Sidebar';
import React, { useEffect, useState } from 'react'
import { FiMenu } from 'react-icons/fi';
import { fetchEmployees, removeEmployee } from '@/redux/features/employeeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import EmployeeCard from '@/components/EmployeeCard';
import RecycleBinButton from '@/components/RecycleBin';
import CreateEmployee from '@/components/PopUpModels/CreateEmployee';
import Confirm from '@/components/PopUpModels/Confirm';
import EmployeeEdit from '@/components/PopUpModels/EditPopUps/EmployeeEdit';
const page = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const dispatch = useDispatch<any>();
    const {employees, loading, fetched, error} = useSelector((state:RootState) => state.employee)
    const [searchQuery, setSearchQuery] = useState("");
    const [localEmployees, setLocalEmployees] = useState(employees);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);

    useEffect(() =>{
      if(!fetched){
        dispatch(fetchEmployees());
      }
    },[fetched,dispatch])
    useEffect(() =>{
      if(employees.length > 0){
        setLocalEmployees(employees)
      }
    },[employees])
    const handleEdit = (index: number) => {
      setSelectedIndex(index)
      setIsEditOpen(true);
    };
  
    const handleRemove = (index: number) => {
      setSelectedIndex(index);
      setIsConfirmOpen(true);
    };
    const confirmRemove = async () =>{
      if(selectedIndex !== null){
        try {
          await dispatch(removeEmployee({id:localEmployees[selectedIndex].id})).unwrap();
          dispatch(fetchEmployees());
          setIsConfirmOpen(false)
          setSelectedIndex(null)
        } catch (error) {
          console.error("Error Removing Employee:", error);
        }
      }
    }
  return (
    <div className='flex'>
      <Sidebar/>
      <div className='p-4 min-h-screen bg-beige ml-14 w-full'>
          <div className='flex items-center justify-between mb-6'>
              <h1 className='text-3xl font-bold text-customblue'>Employee Management</h1>
              <SearchBar placeholder='Search Employees' onSearch={setSearchQuery}/>
          </div>
          <div className="flex space-x-4 mt-4 items-start justify-start w-full mb-3">
            <Button onClick={() => setIsPopupOpen(true)} label="Create Item" variant="primary"/>
          </div>
          <EmployeeHeading/>
          {loading ?(
            <p>Loading..</p>
          ): localEmployees.length > 0 ?(
            <EmployeeCard employees={localEmployees} onEdit={handleEdit} onRemove={handleRemove}/>
          ):error ?(
            <p className='text-red-500'>{error}</p>
          ):(
            <p className='text-black'>No Available Employees</p>
          )}
          <RecycleBinButton onClick={() => setIsRecycleBinOpen(true)}/>

          <CreateEmployee isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}/>
          {selectedIndex !== null &&(
            <EmployeeEdit
            isOpen={isEditOpen}
            onClose={() => {
              setIsEditOpen(false)
              setSelectedIndex(null)
            }}
            employee={localEmployees[selectedIndex]}
            />
          )}
        
          <Confirm message='Are you sure you want to remove Employee?' isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={confirmRemove}/>
      </div>
    </div>
  )
}

export default page