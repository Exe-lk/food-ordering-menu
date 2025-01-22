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

const OrderGrid = ({ orders, handleStatusChange } : OrderGridProps) => {

  const statusColors: { [key: string]: { main: string; light: string } } = {
    Pending: { main: "#FFC107", light: "#FFF8E1" },
    Cooking: { main: "#FF5722", light: "#FFE0E0" },
    Ready: { main: "#03A9F4", light: "#E1F5FE" },
    Served: { main: "#4CAF50", light: "#E8F5E9" },
  };

  const columns: GridColDef[] = [
    {
      field: "table",
      headerName: "Table",
      flex: 1,
    },
    {
      field: "items",
      headerName: "Items",
      flex: 2,
      renderCell: (params) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {params.value.map((item: { name: string; size: string; quantity: number }) => (
            <div key={`${item.name}-${item.size}`}>
              {item.name} - {item.size} x{item.quantity}
            </div>
          ))}
        </div>
      ),
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
            backgroundColor: statusColors[params.value]?.main || "#9C27B0",
            color: "white",
          }}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Cooking">Cooking</MenuItem>
          <MenuItem value="Ready">Ready</MenuItem>
          <MenuItem value="Served">Served</MenuItem>
        </Select>
      ),
      cellClassName: (params) => `status-${params.value.replace(/\s/g, "-").toLowerCase()}`,
    },
  ];

  return (
    <div style={{ height: 600, width: "100%", overflowX: "hidden" }}>
      <DataGrid
        rows={orders.map((order) => ({
          id: order.id,
          items: order.items,
          table: order.table,
          status: order.status,
        }))}
        columns={columns}
        getRowHeight={() => "auto"}
        disableColumnMenu
        sx={{
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            padding: "12px",
            border: "1px solid #",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F4F4F4",
            borderBottom: "2px solid #ddd",
          },
          "& .MuiDataGrid-row": {
            borderBottom: "2px solid #ddd",
          },
          "& .MuiDataGrid-columnSeparator": {
            visibility: "visible",
            borderColor: "#ddd",
          },

          "& .MuiDataGrid-cell.status-pending": {
            backgroundColor: statusColors.Pending.light,
          },
          "& .MuiDataGrid-cell.status-cooking": {
            backgroundColor: statusColors.Cooking.light,
          },
          "& .MuiDataGrid-cell.status-ready-to-serve": {
            backgroundColor: statusColors.Readylight,
          },
          "& .MuiDataGrid-cell.status-served": {
            backgroundColor: statusColors.Served.light,
          },
        }}
      />
    </div>
  );
};

export default OrderGrid;
