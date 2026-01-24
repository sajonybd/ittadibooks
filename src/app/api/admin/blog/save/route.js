

import { NextResponse } from "next/server";
 
 
import { connectDb } from "@/lib/connectDb";

 
export async function POST(req) {
  try {
    const db = await connectDb();
    const { title, html, images = [] } = await req.json();

    if (!title || !html) {
      return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
    }

    const result = await db.collection("posts").insertOne({
      title,
      html,
      images,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    // // console.error("Blog Save Error:", error);
    return NextResponse.json({ error: "Failed to save blog" }, { status: 500 });
  }
}
