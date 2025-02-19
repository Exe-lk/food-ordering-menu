import React from 'react';

const ExternalHeading = () => {
  return (
    <div className='grid grid-cols-9 items-center border bg-black text-customGold font-bold rounded-lg shadow-md p-4 mb-2 text-center'>
      <div>Category</div>
      <div>Brand</div>
      <div>Product Name</div>
      <div>Quantity</div>
      <div>Date In</div>
      <div>Cost Price</div>
      <div>Supplier</div>
      <div>Action</div>
    </div>
  );
};

export default ExternalHeading;
