import { NextResponse } from "next/server";
import { ref, update } from "firebase/database";
import { database } from "@/config/firebase";

export async function OPTIONS() {
  const response = NextResponse.json({});
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();
    if (!orderId) {
      const response = NextResponse.json({ error: "Order ID is required" }, { status: 400 });
      response.headers.set("Access-Control-Allow-Origin", "*");
      return response;
    }
    const orderRef = ref(database, `orders/${orderId}`);
    await update(orderRef, {
      status: "Completed",
      update_at: Date.now(),
    });
    const response = NextResponse.json({ message: "Order updated to Completed" });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error: any) {
    const response = NextResponse.json({ error: error.message }, { status: 500 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}
