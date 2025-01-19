"use client";
import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { MenuItem, Select } from "@mui/material";

interface Order {
  id: number;
  name: string;
  items: { name: string; size: string; quantity: number }[];
  table: string;
  status: string;
}

interface OrderGridProps {
  orders: Order[];
  handleStatusChange: (id: number, newStatus: string) => void;
}

const OrderGrid: React.FC<OrderGridProps> = ({ orders, handleStatusChange }) => {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Customer Name",
      flex: 1,
    },
    {
      field: "items",
      headerName: "Items",
      flex: 2,
      renderCell: (params) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {params.value.map((item: { name: string; size: string; quantity: number }) => (
            <div key={`${item.name}-${item.size}`}>
              {item.name} - {item.size} x{item.quantity}
            </div>
          ))}
        </div>
      ),
    },
    {
      field: "table",
      headerName: "Table",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Select
          value={params.value}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value as string)}
          fullWidth
          style={{
            textTransform: "capitalize",
            backgroundColor:
              params.value === "Pending"
                ? "#FFC107"
                : params.value === "Served"
                ? "#4CAF50"
                : "#9C27B0",
            color: "white",
          }}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Served">Served</MenuItem>
          <MenuItem value="Ready to Serve">Ready to Serve</MenuItem>
        </Select>
      ),
    },
  ];

  return (
    <div style={{ height: 600, width: "100%", overflowX: "hidden" }}>
      <DataGrid
        rows={orders.map((order) => ({
          id: order.id,
          name: order.name,
          items: order.items,
          table: order.table,
          status: order.status,
        }))}
        columns={columns}
        getRowHeight={() => "auto"}
        disableColumnMenu
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F4F4F4",
          },
        }}
      />
    </div>
  );
};

export default OrderGrid;
