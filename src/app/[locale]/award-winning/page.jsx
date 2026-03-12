"use client";
import BookCard from "@/app/components/BookCard";
import SkeletonForBookCollection from "@/app/components/SkeletonForBookCollection/SkeletonForBookCollection";
import Pagination from "@/app/components/Pagination";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

 

export default function BestSellersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 18;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: booksPerPage,
    total: 0,
    totalPages: 0,
  });

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) setCurrentPage(page);
  };

  const t = useTranslations("awardWinners");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/book/getbookForFilter?collection=awardWinners&page=${currentPage}&limit=${booksPerPage}`
        );
        const data = await res.json();
        setBooks(data?.books || []);
        setPagination(
          data?.pagination || {
            page: currentPage,
            limit: booksPerPage,
            total: 0,
            totalPages: 0,
          }
        );
      } catch (error) {
        // // // console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage]);

 
  return (
    <div className="min-h-screen bg-gray-50 p-5 lg:p-6">
      <div className="max-w-7xl mx-auto lg:px-4 py-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-600 text-lg">{t("subtitle")}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {[...Array(12)].map((_, idx) => (
              <SkeletonForBookCollection key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {books.map((book) => (
              <div key={book?._id || book?.bookId} className="border-2 border-gray-300 rounded-lg">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}

       
         {!loading && books.length > 0 && (
          <Pagination
            currentPage={pagination.page || currentPage}
            totalPages={pagination.totalPages || 0}
            onPageChange={handlePageChange}
            totalItems={pagination.total || 0}
            pageSize={pagination.limit || booksPerPage}
          />
        )}
        {!loading && books.length === 0 && (
          <p className="text-center py-10">No books found</p>
        )}
      </div>
    </div>
  );
}
