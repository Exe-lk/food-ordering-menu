import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./features/customerSlice"
import menuReducer from './features/menuSlice'
import portionTypeReducer from './features/portionSlice'
import internalFoodReducer from './features/internalProductSlice'
import cartSliceReducer, { saveCartToFirebase } from './features/cartSlice'
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

// Subscribe to cart changes and sync with Firebase
if(typeof window !== "undefined"){
  let previousCartState = store.getState().cart;
  
  store.subscribe(() => {
    const currentCartState = store.getState().cart;
    
    // Only sync if cart items or totalItems changed (not loading/error states)
    if (
      currentCartState.items !== previousCartState.items ||
      currentCartState.totalItems !== previousCartState.totalItems
    ) {
      previousCartState = currentCartState;
      
      // Dispatch saveCartToFirebase asynchronously
      store.dispatch(saveCartToFirebase({
        items: currentCartState.items,
        totalItems: currentCartState.totalItems,
      }) as any);
    }
  });
}

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
