
import HomeBooks from "../components/HomeBooks"; // Client component

import { getAllBooks } from "@/lib/getAllBooks";
import { getCategories, getNavbarAuthors } from "@/lib/siteDataCache";

export const revalidate = 60; // ISR: rebuild every 60s

export default async function HomePage() {
  const [allBooks, authors, categories] = await Promise.all([
    getAllBooks(),
    getNavbarAuthors(),
    getCategories(),
  ]);

  const collectionKeys = [
    "ittadiBooks",
    "newArrivals",
    "bookfair2025",
    "bhumikaBooks",
    "bestSellers",
    "awardWinners",
  ];

  const collections = collectionKeys.reduce((acc, collectionName) => {
    acc[collectionName] = allBooks
      .filter((book) =>
        book.collections?.some((item) => item?.value === collectionName)
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 12);
    return acc;
  }, {});

  return (
    <div className="bg-gray-200 w-full lg:py-4 min-h-screen">
      <div className="max-w-full w-full mx-auto flex flex-col lg:flex-row gap-2 lg:gap-4">
        <HomeBooks
          allBooks={allBooks}
          authors={authors}
          categories={categories}
          collections={collections}
        />
      </div>
    </div>
  );
}
