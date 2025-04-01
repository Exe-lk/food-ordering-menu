// app/api/cashier/orders/route.ts
import { NextResponse } from "next/server";
import { ref, get } from "firebase/database";
import { database } from "@/config/firebase";

export async function GET() {
  try {
    const ordersRef = ref(database, "orders");
    const snapshot = await get(ordersRef);
    const ordersData = snapshot.val();
    const billedOrders: any[] = [];
    if (ordersData) {
      for (const id in ordersData) {
        if (ordersData[id].status === "Billed") {
          billedOrders.push({ id, ...ordersData[id] });
        }
      }
    }
    const response = NextResponse.json({ orders: billedOrders });
    response.headers.set("Access-Control-Allow-Origin", "*"); 
    return response;
  } catch (error: any) {
    const response = NextResponse.json({ error: error.message }, { status: 500 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}
