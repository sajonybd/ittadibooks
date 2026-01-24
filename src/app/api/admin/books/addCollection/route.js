// // app/api/book-collections/route.js
// import { NextResponse } from "next/server";
// import connectDb from "@/lib/connectDb";

// export async function POST(req) {
//   try {
//     const db = await connectDb();

//     const body = await req.json();
//     const { title } = body;

//     if (!title) {
//       return NextResponse.json({ error: "Title is required" }, { status: 400 });
//     }

//     const exists = await db.collection("bookCollections").findOne({ title });

//     if (exists) {
//       return NextResponse.json(
//         { error: "Collection already exists" },
//         { status: 409 }
//       );
//     }

//     const result = await db.collection("bookCollections").insertOne({
//       title,
//       createdAt: new Date(),
//     });

//     return NextResponse.json({ success: true, id: result.insertedId });
//   } catch (err) {
//     // // // console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
