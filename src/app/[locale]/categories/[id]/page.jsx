"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BookCard from "@/app/components/BookCard";
import Pagination from "@/app/components/Pagination";

export default function CategoryBooksPage() {
  const { id } = useParams();

  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 18;
  const { locale } = useParams();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: booksPerPage,
    total: 0,
    totalPages: 0,
  });

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) setCurrentPage(page);
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
  }, [id]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/book/getbookForFilter?category=${id}&page=${currentPage}&limit=${booksPerPage}`
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
        setBooks([]);
      }
    };

    if (id) fetchBooks();
  }, [currentPage, id]);

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
          {books.map((book) => (
            <div key={book._id} className="border-2 border-gray-200 rounded-lg">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}

      <Pagination
        currentPage={pagination.page || currentPage}
        totalPages={pagination.totalPages || 0}
        onPageChange={handlePageChange}
        totalItems={pagination.total || 0}
        pageSize={pagination.limit || booksPerPage}
      />
    </div>
  );
}
