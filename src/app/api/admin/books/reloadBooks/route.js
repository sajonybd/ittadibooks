import { getAllBooks } from "@/lib/booksCache";
import { NextResponse } from "next/server";


export async function POST() {
  await getAllBooks(true); // force refresh
  return NextResponse.json({ success: true, message: "Books cache refreshed!" });
}
