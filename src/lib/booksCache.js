import { connectDb } from "@/lib/connectDb";

let booksCache = null;
let lastFetched = 0;

export async function getAllBooks(forceRefresh = false) {
  const now = Date.now();

  // Refresh if forced or cache is older than 5 minutes
  if (!booksCache || forceRefresh || now - lastFetched > 5 * 60 * 1000) {
    const db = await connectDb();
    const books = await db
      .collection("books")
      .find(
        {},
        {
          projection: {
            _id: 1,
            bookId: 1,
            title: 1,
            authors: 1,
            translators: 1,
            editors: 1,
            categories: 1,
            collections: 1,
            publisher: 1,
            language: 1,
            price: 1,
            discount: 1,
            discountedPrice: 1,
            soldCount: 1,
            createdAt: 1,
            cover: 1,
            availability: 1,
            inStock: 1,
            isEbook: 1,
          },
        }
      )
      .toArray();

    booksCache = JSON.parse(JSON.stringify(books));
    lastFetched = now;
  }

  return booksCache;
}
