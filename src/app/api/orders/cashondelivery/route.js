// src/app/api/orders/cod/route.js
import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function POST(req) {
  const generateOrderId = (length = 10) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "ORD-";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  try {
    const db = await connectDb();
    const body = await req.json();

    const orderId = generateOrderId();

    // Step 1: Save order
    const order = {
      ...body,
      orderId,
      paymentStatus: "pending", // COD is unpaid initially
      paymentTransactionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertedOrder = await db.collection("orders").insertOne(order);

    // Step 2: Insert payment record (optional)
    await db.collection("payments").insertOne({
      orderId,
      email: body.email,
      amount: body.grandTotal,
      paymentStatus: "pending",
      paymentTransactionId: null,
      paymentDate: null,
      paymentMethod: "cod",
      updatedAt: new Date(),
    });

    // Step 3: Redirect to success page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const redirectUrl = `${baseUrl}/order-success/${orderId}`;
    return NextResponse.redirect(new URL(redirectUrl, req.url), 303);
  } catch (error) {
    // // // console.error("COD Order Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
