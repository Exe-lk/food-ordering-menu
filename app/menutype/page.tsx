"use client"
import React,{useState} from 'react'
import { FiMenu } from 'react-icons/fi'
import SearchBar from '@/components/SearchBar'
import Button from "@/components/Button";
import menuData from '@/data/menus';
import Confirm from "@/components/PopUpModels/Confirm";
import Sidebar from '@/components/Sidebar';
import Heading from '@/components/Heading';
import MenuCard from '@/components/MenuManagement/MenuCard';
import MenuCreate from '@/components/PopUpModels/MenuCreate';
const page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [menus, setMenus] = useState(menuData)

    const handleEdit = (index:number) =>{
      console.log("Editing portion at index:", index);
    }

    const handleRemove = (index:number) =>{
      console.info("Removed Menu: ", index);
      setSelectedProductId(index);
      setIsConfirmOpen(true);
    };

    const confirmRemove = () =>{
      if(selectedProductId !== null){
        setMenus((prevMenus) => prevMenus.filter((_,i) => i !== selectedProductId));
        console.info("Removed Menus: ", selectedProductId);
      }
      setIsConfirmOpen(false);
      setSelectedProductId(null);
    };
  return (
    <div className='p-4 min-h-screen bg-beige'>
      <div className='flex items-center justify-between mb-6'>
        <button onClick={() => setIsSidebarOpen(true)} className='text-2xl text-customblue'>
          <FiMenu/>
        </button>
        <h1 className='text-3xl font-bold text-customblue'>Menu Management</h1>
        <SearchBar placeholder='Search Menu' onSearch={setSearchQuery}/>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() =>setIsSidebarOpen(false)}/>
      <div className='flex space-x-4 mt-4 items-start justify-start w-full mb-3'>
        <Button label='Create Menu' variant='primary' onClick={()=>setIsPopupOpen(true)}/>
      </div>

      <Heading titles={["Menu Name"]}/>
      <MenuCard menus={menus} onEdit={handleEdit} onRemove={handleRemove}/>
      <MenuCreate isOpen={isPopupOpen} onClose={() =>setIsPopupOpen(false)}/>

      <Confirm
        message='Are you sure you want to remove the menu?'
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmRemove}
      />
    </div>
  )
}

export default page