import { connectDb } from "@/lib/connectDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const SORT_FIELD_MAP = {
  "title.bn": "title.bn",
  authorBn: "authors.0.name",
  category: "categories.0.category",
  discountedPrice: "discountedPrice",
  cover: "cover.url",
};

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDb();
    const searchParams = req.nextUrl.searchParams;

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 20)
    );
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const author = searchParams.get("author")?.trim() || "";
    const collection = searchParams.get("collection")?.trim() || "";
    const sortField = searchParams.get("sortField") || "title.bn";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;

    const query = {};

    if (search) {
      query.$or = [
        { "title.bn": { $regex: search, $options: "i" } },
        { "authors.name": { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query["categories.category"] = category;
    }

    if (author) {
      query["authors.name"] = author;
    }

    if (collection) {
      query["collections.value"] = collection;
    }

    const sortKey = SORT_FIELD_MAP[sortField] || "title.bn";
    const sort = { [sortKey]: sortOrder };

    const books = await db
      .collection("books")
      .find(query, {
        projection: {
          title: 1,
          cover: 1,
          bookId: 1,
          publisher: 1,
          authors: 1,
          authorBn: 1,
          price: 1,
          collections: 1,
          categories: 1,
          discount: 1,
          discountedPrice: 1,
        },
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection("books").countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      books,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    // // // console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
