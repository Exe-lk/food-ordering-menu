import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import customerReducer from "./features/customerSlice"
import menuReducer from './features/menuSlice'
import portionTypeReducer from './features/portionSlice'
import internalFoodReducer from './features/internalProductSlice'
import cartSliceReducer from './features/cartSlice'
import orderSliceReducer from './features/orderSlice'
import employeeSliceReducer from './features/employeeSlice'
import loginLogSliceReducer  from './features/loginLogSlice'
import supplierSliceReducer from './features/supplierSlice'
import externalFoodSliceReducer from './features/externalProductSlice'
import categorySliceReducer from './features/ingredientCategorySlice'
import ingredientSliceReducer from './features/ingredientsSlice'
import stockInSliceReducer from './features/stockInSlice'
import stockOutSliceReducer from './features/stockOutSlice'
import transactionSliceReducer from './features/transactionSlice'
import qrSliceReducer from './features/qrSlice'
import Cookies from 'js-cookie'


const store = configureStore({
  reducer: {
    cart: cartSliceReducer,
    customer:customerReducer,
    menuType: menuReducer,
    portionType:portionTypeReducer,
    products: internalFoodReducer, 
    order:orderSliceReducer,
    employee:employeeSliceReducer,
    loginLog:loginLogSliceReducer,
    supplier:supplierSliceReducer,
    externalFood:externalFoodSliceReducer,
    categories: categorySliceReducer,
    ingredients:ingredientSliceReducer,
    stockIn:stockInSliceReducer,
    stockOut:stockOutSliceReducer,
    transactions:transactionSliceReducer,
    qr:qrSliceReducer,
    

  },
});

if(typeof window !== "undefined"){
  store.subscribe(() =>{
    const cartState = store.getState().cart;
    Cookies.set("cart",JSON.stringify(cartState),{expires:7})
  })
}

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
