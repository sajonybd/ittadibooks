



import HomeBooks from "../components/HomeBooks"; // Client component

import { getAllBooks } from "@/lib/getAllBooks";

export const revalidate = 60; // ISR: rebuild every 60s

export default async function HomePage() {
 

  // Fetch all books at build time (ISR)
  const allBooks = await getAllBooks();

  return (
    <div className="bg-gray-200 w-full lg:py-4 min-h-screen">
      <div className="max-w-full w-full mx-auto flex flex-col lg:flex-row gap-2 lg:gap-4">
        <HomeBooks allBooks={allBooks} />
      </div>
    </div>
  );
}
