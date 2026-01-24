


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
    const rawBody = await req.text();
    const parsed = new URLSearchParams(rawBody);
    const successData = Object.fromEntries(parsed.entries());

    const tran_id = successData?.tran_id;

    if (!tran_id || successData?.status !== "VALID") {
      return NextResponse.json(
        { error: "Invalid payment data" },
        { status: 400 }
      );
    }

    const orderId = generateOrderId();

    // Step 1: Update order status and add orderId
    const updateResult = await db.collection("orders").updateOne(
      { paymentTransactionId: tran_id },
      {
        $set: {
          paymentStatus: "paid",
          orderId: orderId,
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: "Order not found or update failed" },
        { status: 404 }
      );
    }

    // Step 2: Get the updated order
    const order = await db.collection("orders").findOne({
      paymentTransactionId: tran_id,
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order retrieval failed after update" },
        { status: 500 }
      );
    }

    // Step 3: Insert payment record
    await db.collection("payments").insertOne({
      orderId: orderId,
      email: order.email,
      amount: order.grandTotal,
      paymentStatus: "paid",
      paymentTransactionId: tran_id,
      paymentDate: new Date(),
      paymentMethod: "sslcommerz",
      updatedAt: new Date(),
    });

    // Step 4: Redirect to success page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const redirectUrl = `${baseUrl}/order-success/${orderId}`;
    return NextResponse.redirect(new URL(redirectUrl, req.url), 303);
  } catch (error) {
    // // // console.error("Success Payment Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
