import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchQuery = (url.searchParams.get("query") || "").trim();
    const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(url.searchParams.get("limit")) || 9, 1),
      48
    );
    const skip = (page - 1) * limit;
    const db = await connectDb();

    const filter = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { nameBn: { $regex: searchQuery, $options: "i" } },
          ],
        }
      : {};

    const [authors, total] = await Promise.all([
      db
        .collection("authors")
        .find(filter, {
          projection: {
            _id: 1,
            name: 1,
            nameBn: 1,
            imageUrl: 1,
            description: 1,
            descriptionBn: 1,
            isFollowing: 1,
          },
        })
        .sort({ nameBn: 1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("authors").countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      authors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
