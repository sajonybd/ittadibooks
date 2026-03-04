import { connectDb } from "@/lib/connectDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const SORT_FIELD_MAP = {
  orderId: "orderId",
  customer: "fullName",
  email: "email",
  amount: "grandTotal",
  paymentStatus: "paymentStatus",
  createdAt: "createdAt",
};

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
    const skip = (page - 1) * limit;
    const search = searchParams.get("search")?.trim() || "";
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const sortKey = SORT_FIELD_MAP[sortField] || "createdAt";
    const sort = { [sortKey]: sortOrder };

    const query = {};
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const db = await connectDb();
    const orders = await db
      .collection("orders")
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection("orders").countDocuments(query);
    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      success: true,
      orders,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

