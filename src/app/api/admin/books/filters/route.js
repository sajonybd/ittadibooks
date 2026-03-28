import { connectDb } from "@/lib/connectDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDb();
    const booksCollection = db.collection("books");

    const categoriesRaw = await booksCollection.distinct("categories.category");
    const authorsRaw = await booksCollection.distinct("authors.name");
    const collectionsRaw = await booksCollection
      .aggregate([
        { $unwind: "$collections" },
        {
          $match: {
            "collections.value": { $exists: true, $nin: [null, ""] },
          },
        },
        {
          $group: {
            _id: "$collections.value",
            label: { $first: "$collections.label" },
          },
        },
        {
          $project: {
            _id: 0,
            value: "$_id",
            label: { $ifNull: ["$label", "$_id"] },
          },
        },
        { $sort: { label: 1 } },
      ])
      .toArray();

    const categories = categoriesRaw
      .filter((value) => typeof value === "string" && value.trim() !== "")
      .sort((a, b) => a.localeCompare(b, "bn"))
      .map((value) => ({ value, label: value }));

    const uniqueAuthors = [
      ...new Set(
        authorsRaw
          .filter((value) => typeof value === "string" && value.trim() !== "")
          .map((value) => value.trim().replace(/\/$/, ""))
      ),
    ];

    const authors = uniqueAuthors
      .sort((a, b) => a.localeCompare(b, "bn"))
      .map((value) => ({ value, label: value }));

    return NextResponse.json({
      success: true,
      categories,
      authors,
      collections: collectionsRaw,
    });
  } catch (error) {
    console.error("GET /api/admin/books/filters failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
