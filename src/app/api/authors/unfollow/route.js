import { connectDb } from "@/lib/connectDb";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { authorId } = await request.json();

    if (!authorId) {
      return NextResponse.json({ error: "Missing author ID" }, { status: 400 });
    }

    const db = await connectDb();
    const authorCollection = db.collection("authors");

    const updateResult = await authorCollection.updateOne(
      {
        _id: new ObjectId(authorId),
        followers: token.email, // only if currently following
      },
      {
        $pull: { followers: token.email },
        $inc: { followerCount: -1 },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ message: "Not following or author not found" });
    }

    return NextResponse.json({ message: "Successfully unfollowed the author" });
  } catch (error) {
    // // // console.error("Unfollow Author Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
