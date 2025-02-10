import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import customerReducer from "./features/customerSlice"
import menuReducer from './features/menuSlice'
import portionTypeReducer from './features/portionSlice'
import internalFoodReducer from './features/internalProductSlice'
import cartSliceReducer from './features/cartSlice'
import orderSliceReducer from './features/orderSlice'
import employeeSliceReducer from './features/employeeSlice'


const store = configureStore({
  reducer: {
    cart: cartSliceReducer,
    customer:customerReducer,
    menuType: menuReducer,
    portionType:portionTypeReducer,
    products: internalFoodReducer, 
    order:orderSliceReducer,
    employee:employeeSliceReducer,

  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
