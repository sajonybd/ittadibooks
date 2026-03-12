"use client";
import React, { useEffect, useState } from "react";
import BrowseSidebar from "./sidebar/Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import BookCard from "./BookCard";
import SkeletonForBookCollection from "./SkeletonForBookCollection/SkeletonForBookCollection";
import Pagination from "./Pagination";
import { buildBookListQuery } from "@/lib/bookListQuery";

export default function FilteredBookGrid({
  title,
  authors = [],
  categories = [],
  collection,
  isLoading = false,
}) {
  const [filters, setFilters] = useState({
    categories: [],
    authors: [],
    publishers: [],
    ebookOnly: false,
    inStockOnly: false,
  });
  const [sort, setSort] = useState("ALL_BOOKS");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(isLoading);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: booksPerPage,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort, collection]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const query = buildBookListQuery({
          page: currentPage,
          limit: booksPerPage,
          sort,
          collection,
          categories: filters.categories,
          authors: filters.authors,
          publishers: filters.publishers,
          ebookOnly: filters.ebookOnly,
          inStockOnly: filters.inStockOnly,
        });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/book/getbookForFilter?${query}`
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
        setPagination({
          page: currentPage,
          limit: booksPerPage,
          total: 0,
          totalPages: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [collection, currentPage, filters, sort]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen lg:p-6 bg-[#F9FAFB] lg:bg-transparent">
      <div className="max-w-7xl mx-auto lg:px-4 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="sticky top-6">
              <BrowseSidebar
                sort={sort}
                setSort={setSort}
                filters={filters}
                setFilters={setFilters}
                authors={authors}
                categories={categories}
              />
            </div>
          </div>

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        <div className="text-center mb-6">
          <h1 className="text-4xl px-2 font-bold text-gray-800 lg:text-start">
            {title}
          </h1>
        </div>
        <Breadcrumbs sort={sort} filters={filters} />
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {[...Array(12)].map((_, idx) => (
              <SkeletonForBookCollection key={idx} />
            ))}
          </div>
        ) : books.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {books.map((book) => (
                <BookCard key={book?._id || book?.bookId} book={book} />
              ))}
            </div>

            <Pagination
              currentPage={pagination.page || currentPage}
              totalPages={pagination.totalPages || 0}
              onPageChange={handlePageChange}
              totalItems={pagination.total || 0}
              pageSize={pagination.limit || booksPerPage}
            />
          </>
        ) : (
          <p className="text-center py-10">No books found</p>
        )}
      </div>
        </div>
      </div>
    </div>
  );
}
