// app/lib/getAllBooks.js
export async function getAllBooks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/book/getAll`, {
    next: { revalidate: 60 * 60 }, // revalidate every 1 hour (optional)
  });
  if (!res.ok) throw new Error("Failed to fetch books");
  const data = await res.json();
  return data.books || [];
}
