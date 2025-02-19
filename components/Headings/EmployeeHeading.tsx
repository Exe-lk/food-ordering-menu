import React from 'react'

const EmployeeHeading = () => {
  return (
    <div className="grid grid-cols-6 items-center border bg-black text-customGold font-bold rounded-lg shadow-md p-4 mb-2 text-center">
      <div>Name</div>
      <div>Username</div>
      <div>Password</div>
      <div>Contact</div>
      <div>Role</div>
      <div>Action</div>
    </div>
  )
}

export default EmployeeHeading
