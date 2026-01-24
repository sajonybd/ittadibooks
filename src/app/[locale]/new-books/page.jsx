"use client";
import BookCard from "@/app/components/BookCard";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

 

export default function NewBooksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 18;
  const [books, setBooks] = useState([]);
  const totalPages = Math.ceil(books.length / booksPerPage);
// const { locale } = useRouter();
  const paginatedBooks = books.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const t = useTranslations("newBooks");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/getbookbycollection?collection=${"newArrivals"}`
        );
        const data = await res.json();
        setBooks(data.books);
      } catch (error) {
        // // // console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

 
  return (
    <div className="min-h-screen lg:p-6">
      <div className="max-w-7xl mx-auto lg:px-4 py-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t("title")}
          </h1>
          {/* <p className="text-gray-600 text-lg">{t("subtitle")}</p> */}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {paginatedBooks.map((book,i) => (
            <div key={i} className=" rounded-2xl">
              <BookCard book={book} />
            </div>
          ))}
        </div>

        {paginatedBooks.length > 0 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              {t("prev")}
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
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
              {t("next")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

