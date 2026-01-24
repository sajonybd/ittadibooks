import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const db = await connectDb();

    const user = await db
      .collection("users")
      .findOne({ email }, { projection: { address: 1, name: 1, _id: 0 } });

    return NextResponse.json({
      address: user?.address || {},
      name: user?.name || "",
    });
    // return NextResponse.json({ address: user?.address || {} });
  } catch (error) {
    // // // console.error("Fetch address error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
