"use client"
import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'

interface PortionProps{
    isOpen:boolean;
    onClose: () => void;

}
const PortionCreate = ({isOpen, onClose}:PortionProps) => {
    const [portionName, setPortionName] = useState("");
    const [portionServe, setPortionServe] = useState("");
  return (
    <div>PortionCreate</div>
  )
}

export default PortionCreate