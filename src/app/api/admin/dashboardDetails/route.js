// /app/api/admin/stats/route.js
import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await connectDb();

    const orders = db.collection("orders");
    const users = db.collection("users");

    // Total orders
    const totalOrders = await orders.countDocuments();

    // Pending orders
    const pendingOrders = await orders.countDocuments({
      paymentStatus: "pending",
    });

    // Total users
    const totalUsers = await users.countDocuments();

    // Total revenue (sum of grandTotal where paymentStatus = paid)
    const revenueAgg = await orders
      .aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$grandTotal" } } },
      ])
      .toArray();

    const revenue = revenueAgg[0]?.total || 0;

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      totalUsers,
      revenue,
    });
  } catch (error) {
    // // console.error("Stats API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
