import { connectDb } from "@/lib/connectDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const ALLOWED_PAYMENT_STATUS = new Set(["pending", "paid", "failed", "refunded"]);
const ALLOWED_DELIVERY_STATUS = new Set([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams =
      params && typeof params.then === "function" ? await params : params;
    const rawId = (resolvedParams?.id || "").trim();
    if (!rawId) {
      return NextResponse.json({ error: "Order id is required" }, { status: 400 });
    }

    const body = await req.json();
    const paymentStatus = body?.paymentStatus ? String(body.paymentStatus).toLowerCase() : null;
    const deliveryStatus = body?.deliveryStatus ? String(body.deliveryStatus).toLowerCase() : null;

    const update = {};
    if (paymentStatus) {
      if (!ALLOWED_PAYMENT_STATUS.has(paymentStatus)) {
        return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
      }
      update.paymentStatus = paymentStatus;
    }
    if (deliveryStatus) {
      if (!ALLOWED_DELIVERY_STATUS.has(deliveryStatus)) {
        return NextResponse.json({ error: "Invalid delivery status" }, { status: 400 });
      }
      update.deliveryStatus = deliveryStatus;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No status value provided" }, { status: 400 });
    }

    update.updatedAt = new Date();

    const filter = ObjectId.isValid(rawId)
      ? { _id: new ObjectId(rawId) }
      : { orderId: rawId };

    const db = await connectDb();
    const result = await db.collection("orders").updateOne(filter, { $set: update });

    if (!result.matchedCount) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

