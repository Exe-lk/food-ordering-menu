"use client"
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React from 'react'

interface ReusableGridProps {
  columns: GridColDef[];
  rows: any[];
  height?: number;
}

const ReusableGrid = ({columns, rows, height = 600}:ReusableGridProps) => {
  return (
    <div style={{height, width:'100%'}}>
      <DataGrid
        rows={rows}
        columns={columns}
        className='bg-beige'
        sx={{
          "& .MuiDataGrid-columnHeaders":{
            backgroundColor: "#F4F4F4",
            borderBottom:"2px solid #ddd"
          },
          "& .MuiDataGrid-row": {
            borderBottom: "1px solid #ddd",
          },
          "& .MuiDataGrid-cell": {
            padding: "12px",
          },
        }}
      
      />
    </div>
  )
}

export default ReusableGrid