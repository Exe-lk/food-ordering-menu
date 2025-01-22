"use client";
import React from "react";
import { products } from "@/data/products";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import ReusableGrid from "./ReusableGrid";

type Portion = {
  size: string;
  price: number;
};

const ProductsGrid = () => {
  const rows = Object.entries(products).flatMap(([category, items]) =>
    items.map((item, index) => ({
      id: item.id, 
      name: item.name,
      category,
      portions: item.portions
        .map((p: Portion) => `${p.size}: ${p.price}`) 
        .join(", "),
      image: item.image,
    }))
  );


  const columns: GridColDef[] = [
    { field: "name", headerName: "Product Name", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "portions", headerName: "Portions & Prices", flex: 2 },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => ( 
        <img
          src={params.value as string} 
          alt={params.row.name}
          style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
        />
      ),
    },
  ];

  return (
    <div className="p-4 min-h-screen">
      <ReusableGrid columns={columns} rows={rows}  />
    </div>
  );
};

export default ProductsGrid;
