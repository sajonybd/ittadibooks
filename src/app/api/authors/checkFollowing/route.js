


import { connectDb } from "@/lib/connectDb";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get("authorId");

    if (!authorId) {
      return NextResponse.json({ error: "Missing author ID" }, { status: 400 });
    }

    const db = await connectDb();
    const authorCollection = db.collection("authors");

    const author = await authorCollection.findOne(
      { _id: new ObjectId(authorId) },
      { projection: { followers: 1 } }
    );

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    const isFollowing = Array.isArray(author.followers) && author.followers.includes(token.email);

    return NextResponse.json({ isFollowing });
  } catch (error) {
    // // // console.error("Check Follow Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
