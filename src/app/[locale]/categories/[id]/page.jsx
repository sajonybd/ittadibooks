"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BookCard from "@/app/components/BookCard";
import { useLocale } from "next-intl";

export default function CategoryBooksPage() {
  const { id } = useParams();

  // const locale = useLocale();
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 18;
  const { locale } = useParams();
  const totalPages = Math.ceil(books.length / booksPerPage);

  const paginatedBooks = books.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/getByName/${id}`
        );
        const data = await res.json();
        setCategory(data || []);
      } catch (error) {
        // // // console.error("Error fetching books:", error);
      }
    };
  

    if (id) fetchCategory();

   
   const fetchBooks = async () => {
  try {
    if (!category?.bn) return;

    // Encode the category name safely for URL
    const encodedCategory = encodeURIComponent(category.bn);
    

    // Use query parameter instead of path param
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/byQuery?category=${category.en}`
    );

    const data = await res.json();

    // Handle different possible response formats
    if (Array.isArray(data)) {
      setBooks(data);
    } else if (Array.isArray(data.books)) {
      setBooks(data.books);
    } else {
      setBooks([]);
    }
  } catch (error) {
    // // console.error("Error fetching books:", error);
    setBooks([]);
  }
};


    if (category?.bn) fetchBooks();
  }, [id, category?.bn]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-3xl text-center font-bold mb-6 capitalize">
        {category?.[locale]}
      </h1>
      {books.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No books available in this category.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          {paginatedBooks.map((book) => (
            <div key={book._id} className="border-2 border-gray-200 rounded-lg">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}

      {paginatedBooks.length > 0 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1
                ? "bg-[#67bee4] text-white"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
