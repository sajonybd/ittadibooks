


import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import { ObjectId } from "mongodb";

export async function GET(request, context) {
    const params = await context.params; // unwrap if Promise
    const { id } = params;

    try {
        const db = await connectDb();
        const fileDoc = await db.collection("pdfs").findOne({ _id: new ObjectId(id) });

        if (!fileDoc || !fileDoc.link) {
            return NextResponse.json({ error: "PDF not found" }, { status: 404 });
        }

        const match = fileDoc.link.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (!match) {
            return NextResponse.json({ error: "Invalid Google Drive link" }, { status: 400 });
        }
        const fileId = match[1];
        const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

        const res = await fetch(driveUrl);
        if (!res.ok) throw new Error("Failed to fetch PDF from Drive");

        const arrayBuffer = await res.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Cache-Control": "no-store, no-cache, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch (error) {
        console.error("PDF Streaming Error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
