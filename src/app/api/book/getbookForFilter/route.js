 


import { connectDb } from "@/lib/connectDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
     

    const db = await connectDb();

    const { searchParams } = new URL(req.url);
    const sortParam = searchParams.get("sort") || "ID_DESC";
    const authorsParam = searchParams.get("authors") || "";
    const publishersParam = searchParams.get("publishers") || "";
    const ebookOnly = searchParams.get("ebookOnly") === "true";
    const inStockOnly = searchParams.get("inStockOnly") === "true";

    // 🔹 Build filter object
    const filter = {};

    if (authorsParam) {
      const authorsArray = authorsParam.split(",");
      filter["authors.uid"] = { $in: authorsArray };
    }

    if (publishersParam) {
      const publishersArray = publishersParam.split(",");
      filter.publisher = { $in: publishersArray };
    }

    if (ebookOnly) {
      filter.format = /eBook/i; // assuming eBooks have "eBook" in format
    }

    if (inStockOnly) {
      filter.orderType = "Buy Now"; // or any logic to determine stock
    }

    // 🔹 Handle sort/filter logic
    let sort = {};
    switch (sortParam) {
      case "BEST_SELLERS":
        filter["collections.value"] = "bestSellers"; // only books tagged as best sellers
        sort = { createdAt: -1 }; // newest best sellers first
        break;
      case "NEW_ARRIVALS":
        filter["collections.value"] = "newArrivals"; // only new arrivals
        sort = { createdAt: -1 };
        break;
      case "PRICE_ASC":
        sort = { discountedPrice: 1 };
        break;
      case "PRICE_DESC":
        sort = { discountedPrice: -1 };
        break;
      case "ID_DESC":
      default:
        sort = { createdAt: -1 };
        break;
    }

    const books = await db
      .collection("books")
      .find(filter, {
        projection: {
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
        },
      })
      .sort(sort)
      .toArray();

    return NextResponse.json({ success: true, books });
  } catch (error) {
    // // console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
