import { connectDb } from "@/lib/connectDb";

let booksCache = null;
let lastFetched = 0;

export async function getAllBooks(forceRefresh = false) {
  const now = Date.now();

  // Refresh if forced or cache is older than 5 minutes
  if (!booksCache || forceRefresh || now - lastFetched > 5 * 60 * 1000) {
    const db = await connectDb();
    const books = await db.collection("books").find().toArray();

    booksCache = JSON.parse(JSON.stringify(books));
    lastFetched = now;
  }

  return booksCache;
}
