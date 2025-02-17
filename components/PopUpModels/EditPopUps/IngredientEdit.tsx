"use client";
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchIngredients } from "@/redux/features/ingredientsSlice";
const IngredientEdit = () => {
  return (
    <div>IngredientEdit</div>
  )
}

export default IngredientEdit