import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { code, subtotal } = await req.json();
    const normalizedCode = String(code || "").trim();
    const normalizedSubtotal = Number(subtotal) || 0;

    if (!normalizedCode) {
      return NextResponse.json(
        { valid: false, error: "Promo code is required" },
        { status: 400 }
      );
    }

    const db = await connectDb();
    const promo = await db.collection("promoCodes").findOne(
      { code: normalizedCode },
      {
        projection: {
          _id: 0,
          active: 1,
          discountType: 1,
          discountValue: 1,
        },
      }
    );

    if (!promo || !promo.active) {
      return NextResponse.json(
        { valid: false, error: "Invalid promo code" },
        { status: 404 }
      );
    }

    let discountAmount = 0;
    if (promo.discountType === "fixed") {
      discountAmount = promo.discountValue;
    } else if (promo.discountType === "percentage") {
      discountAmount = (normalizedSubtotal * promo.discountValue) / 100;
    }

    return NextResponse.json({
      valid: true,
      discount: Math.max(0, Math.round(discountAmount)),
    });
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: "Failed to validate promo code" },
      { status: 500 }
    );
  }
}
