import { getAllBooks as getBooksFromCache } from "@/lib/booksCache";

export async function getAllBooks() {
  try {
    return await getBooksFromCache();
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return [];
  }
}
