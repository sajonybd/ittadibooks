 
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";

export async function POST(req) {
  try {
    const db = await connectDb();
    const data = await req.json();

    // Optional: basic validation
    if (!data.code || !data.discountValue) {
      return NextResponse.json({ error: "Code and discountValue are required" }, { status: 400 });
    }

    // Save to MongoDB
    const result = await db.collection("promoCodes").insertOne({
      code: data.code,
      discountType: data.discountType || "fixed",
      discountValue: data.discountValue,
      minPurchase: data.minPurchase || 0,
      maxUsage: data.maxUsage || null,
      usedCount: 0,
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      endDate: data.endDate ? new Date(data.endDate) : null,
      active: data.active !== undefined ? data.active : true,
    });

    return NextResponse.json({ message: "Promo code created", promoCode: result });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create promo code" }, { status: 500 });
  }
}
