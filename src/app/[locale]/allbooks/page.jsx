 
 
import AllBooksPage from "@/app/components/AllBooksPage";
import { getAllBooks } from "@/lib/booksCache";

export const revalidate = false;

export default async function Page() {
  const books = await getAllBooks()

  return <AllBooksPage books={books} />;
}
