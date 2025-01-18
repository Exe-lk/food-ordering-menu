import React from 'react'
import OrderCard from './_components/OrderCard';

const page = () => {
    const orders = [
        {
          name: "David Moore",
          table: "01",
          items: [
            { name: "Garlic Pasta", size: "Large", quantity: 1 },
            { name: "Garlic Pasta", size: "Regular", quantity: 5 },
            { name: "Alfredo", size: "Large", quantity: 5 },
            { name: "Carbonara", size: "Large", quantity: 5 },
          ],
          total: "12000 LKR",
          status: "Ready",
        },
        {
          name: "Jane Doe",
          table: "04",
          items: [
            { name: "Garlic Pasta", size: "Large", quantity: 1 },
            { name: "Garlic Pasta", size: "Regular", quantity: 5 },
            { name: "Alfredo", size: "Large", quantity: 5 },
            { name: "Carbonara", size: "Large", quantity: 5 },
          ],
          total: "12000 LKR",
          status: "Cooking",
        },
        {
          name: "John Doe",
          table: "02",
          items: [
            { name: "Garlic Pasta", size: "Large", quantity: 1 },
            { name: "Garlic Pasta", size: "Regular", quantity: 5 },
            { name: "Alfredo", size: "Large", quantity: 5 },
            { name: "Carbonara", size: "Large", quantity: 5 },
          ],
          total: "12000 LKR",
          status: "Served",
        },
      ];
  return (
    <div className='p-4 bg-gray-100 min-h-screen'>
        <h1 className='text-3xl font-bold mb-4 text-black'>Order Management</h1>
        <div className='flex justify-between items-center mb-6'>
            <div className='flex space-x-2'>
                {["All","Served", "Ready", "Cooking","New Order"].map((filter) =>(
                    <button
                    key={filter}
                    className={`px-4 py-2 rounded-md ${
                        filter === "All"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
            <input 
                type="text"
                placeholder='Search'
                className='border border-gray-200 rounded-md px-4 py-2 bg-white'
            />
        </div>
        <div className='container mx-0 px-4 py-2 items-center justify-center'>
        <div className='grid grid-cols-3 gap-4'>
            {orders.map((order, index) =>(
                <OrderCard
                    key={index}
                    name={order.name}
                    table={order.table}
                    items={order.items}
                    total={order.total}
                    status={order.status as "Ready" | "Cooking" | "Served" | "New Order"}
                />
            ))}
        </div>
        </div>

    </div>
  )
}

export default page