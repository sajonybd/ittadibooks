import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const params = await context.params; // unwrap if Promise
  const { id } = params; // pdf id from URL

   
 
  
 const filePath = path.join(
    process.cwd(),
    "src",
    "app",
    "protectedPdfs",
    `${id}.pdf`
  );

  console.log("Resolved file path:", filePath);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ message: "PDF not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  console.log("Serving PDF file:", fileBuffer.length, "bytes");

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
