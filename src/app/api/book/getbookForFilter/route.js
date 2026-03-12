import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req) {
  try {
    const db = await connectDb();

    const { searchParams } = new URL(req.url);
    const sortParam = searchParams.get("sort") || "ALL_BOOKS";
    const collection = searchParams.get("collection") || "";
    const categoryParam = searchParams.get("category") || "";
    const categoryBnParam = searchParams.get("categoryBn") || "";
    const excludeBookId = searchParams.get("excludeBookId") || "";
    const authorsParam = searchParams.get("authors") || "";
    const publishersParam = searchParams.get("publishers") || "";
    const ebookOnly = searchParams.get("ebookOnly") === "true";
    const inStockOnly = searchParams.get("inStockOnly") === "true";
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 12, 1), 48);
    const skip = (page - 1) * limit;

    const filter = {};

    if (collection) {
      filter["collections.value"] = collection;
    }

    if (categoryBnParam) {
      filter["categories.category"] = categoryBnParam;
    } else if (categoryParam) {
      const categoryDoc = await db.collection("categories").findOne(
        { en: categoryParam },
        { projection: { bn: 1 } }
      );

      if (!categoryDoc?.bn) {
        return NextResponse.json(
          {
            success: true,
            books: [],
            pagination: { page, limit, total: 0, totalPages: 0 },
          },
          { status: 200 }
        );
      }

      filter["categories.category"] = categoryDoc.bn;
    }

    if (excludeBookId) {
      filter.bookId = { $ne: excludeBookId };
    }

    if (authorsParam) {
      const authorsArray = authorsParam.split(",");
      filter.$and = authorsArray.map((author) => ({
        "authors.name": {
          $regex: `^${escapeRegex(author.trim())}(?:\\s*/|$)`,
          $options: "i",
        },
      }));
    }

    if (publishersParam) {
      const publishersArray = publishersParam.split(",");
      filter.publisher = { $in: publishersArray };
    }

    if (ebookOnly) {
      filter.isEbook = true;
    }

    if (inStockOnly) {
      filter.inStock = true;
    }

    let sort = {};
    switch (sortParam) {
      case "SOLD_COUNT_DESC":
      case "BEST_SELLERS":
        sort = { soldCount: -1, createdAt: -1 };
        break;
      case "PRICE_ASC":
        sort = { discountedPrice: 1 };
        break;
      case "PRICE_DESC":
        sort = { discountedPrice: -1 };
        break;
      case "ID_DESC":
      case "ALL_BOOKS":
      default:
        sort = { createdAt: -1 };
        break;
    }

    const [books, total] = await Promise.all([
      db
        .collection("books")
        .find(filter, {
          projection: {
            _id: 1,
            bookId: 1,
            title: 1,
            cover: 1,
            authors: 1,
            price: 1,
            collections: 1,
            categories: 1,
            discount: 1,
            discountedPrice: 1,
            publisher: 1,
            createdAt: 1,
            soldCount: 1,
            inStock: 1,
            isEbook: 1,
          },
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("books").countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    // // console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
