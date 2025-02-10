import {ref, onValue} from "firebase/database";
import { database } from "@/config/firebase";
import { setOrders, Order } from "@/redux/features/orderSlice";
import { AppDispatch } from "@/redux/store";

/**
 * Sets up a realtime listener to the "orders" node in Firebase.
 * When orders change, the provided dispatch function is used
 * to update the Redux state via the setOrders action.
 *
 * @param dispatch - The Redux dispatch function.
 * @returns A function that unsubscribes from the realtime listener.
 */

export const subScribeToOrders = (dispatch:AppDispatch) =>{
    const orderRef = ref(database,"orders");
    const unsubscribe = onValue(orderRef,(snapShot) =>{
        const orderData = snapShot.val();
        const orders:Order[] = [];
        if(orderData){
            for (const id in orderData){
                const data = orderData[id];
                orders.push({
                    id,
                    items:data.items,
                    phoneNumber:data.phoneNumber,
                    tableNumber:data.tableNumber,
                    status:data.status,
                    created_at:data.created_at
                    ? new Date(data.created_at).toISOString()
                    : new Date().toISOString(),
                    update_at:data.update_at
                    ? new Date(data.update_at).toISOString()
                    :undefined
                });
            }
        }
        dispatch(setOrders(orders));
    });
    return unsubscribe;
}