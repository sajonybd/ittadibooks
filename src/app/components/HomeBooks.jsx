 

"use client";
import React, { useState, useEffect } from "react";
import BrowseSidebar from "./sidebar/Sidebar";
import BookCollection from "./bookCollection/BookCollection";
import Breadcrumbs from "./Breadcrumbs";
import BookCard from "./BookCard";
import CustomKeenSlider from "./CustomKeenSlider/CustomKeenSlider";
import Notice from "./Notice/Notice";
import Link from "next/link";
import { useTranslations } from "next-intl";
import VideoSection from "./VideoSection";
import BookSlider from "./SliderForBooks/SliderForBooksNew";
import BannerSlider from "./SliderForBooks/SliderForBooksNew";

export default function HomeBooks({ allBooks }) {
  const bookcollection = useTranslations("bookCollection");
  const [filters, setFilters] = useState({
    categories: [],
    authors: [],
    publishers: [],
    ebookOnly: false,
    inStockOnly: false,
  });
  const [sort, setSort] = useState("ALL_BOOKS");
  const [books, setBooks] = useState(allBooks);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  useEffect(() => {
    let filtered = [...allBooks];
    if (filters.categories?.length) {
      filtered = filtered.filter((book) =>
        book.categories?.some((cat) =>
          filters.categories.includes(cat.category)
        )
      );
    }

    
    if (filters.authors?.length) {
      filtered = filtered.filter((b) =>
        b.authors?.some((a) => {
          // take only part before `/`
          const banglaName = a.name.split("/")[0].trim();
          return filters.authors.includes(banglaName);
        })
      );
    }

    if (filters.publishers?.length)
      filtered = filtered.filter((b) =>
        filters.publishers.includes(b.publisher)
      );
    if (filters.ebookOnly) filtered = filtered.filter((b) => b.isEbook);
    if (filters.inStockOnly) filtered = filtered.filter((b) => b.inStock);

    if (sort === "SOLD_COUNT_DESC")
      filtered.sort((a, b) => b.soldCount - a.soldCount);
    else if (sort === "PRICE_ASC") filtered.sort((a, b) => a.price - b.price);
    else if (sort === "PRICE_DESC") filtered.sort((a, b) => b.price - a.price);
    else if (sort === "ID_DESC")
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setBooks(filtered);
    setCurrentPage(1);
  }, [filters, sort, allBooks]);

  const totalPages = Math.ceil(books.length / booksPerPage);
  const paginatedBooks = books.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className="lg:w-72 shrink-0">
        <div className="sticky top-6">
          <BrowseSidebar
            sort={sort}
            setSort={setSort}
            filters={filters}
            setFilters={setFilters}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        {filters.authors?.length > 0 ||
        filters.categories?.length > 0 ||
        filters.publishers?.length > 0 ||
        filters.ebookOnly ||
        filters.inStockOnly ||
        sort !== "ALL_BOOKS" ? (
          <div>
            <Breadcrumbs sort={sort} filters={filters} />
            {paginatedBooks.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                  {paginatedBooks.map((book, idx) => (
                    <BookCard key={idx} book={book} />
                  ))}
                </div>

                {/* Advanced Pagination */}
                {paginatedBooks.length > 0 && (
                  <div className="flex justify-center mt-8 space-x-2">
                    {/* Prev */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      disabled={currentPage === 1}
                    >
                      পূর্ববর্তী
                    </button>

                    {/* First page + leading ellipsis */}
                    {currentPage > 3 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className={`px-3 py-1 border rounded ${
                            currentPage === 1
                              ? "bg-[#67bee4] text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          1
                        </button>
                        <span className="px-2">...</span>
                      </>
                    )}

                    {/* Pages around current */}
                    {[...Array(totalPages)]
                      .map((_, i) => i + 1)
                      .filter(
                        (page) =>
                          page >= currentPage - 2 && page <= currentPage + 2
                      )
                      .map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 border rounded ${
                            currentPage === page
                              ? "bg-[#67bee4] text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                    {/* Last page + trailing ellipsis */}
                    {currentPage < totalPages - 2 && (
                      <>
                        <span className="px-2">...</span>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className={`px-3 py-1 border rounded ${
                            currentPage === totalPages
                              ? "bg-[#67bee4] text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    {/* Next */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      disabled={currentPage === totalPages}
                    >
                      পরবর্তী
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center py-10">No books found</p>
            )}
          </div>
        ) : (
          // Default homepage content
          <div>
            {/* <CustomKeenSlider /> */}
            <BannerSlider/>
            <Notice />
            
            <VideoSection />
            <BookCollection
              page={"/ittadi-books"}
              collection={"ittadiBooks"}
              titleText={bookcollection("ittadiBooks")}
            />
            <BookCollection
              page={"/new-books"}
              collection={"newArrivals"}
              titleText={bookcollection("newBooks")}
            />
            <BookCollection
              page={"/book-fair-2025"}
              collection={"bookfair2025"}
              titleText={bookcollection("bookFair")}
            />
            <BookCollection
              page={"/bhumika-book"}
              collection={"bhumikaBooks"}
              titleText={bookcollection("bhumikaBooks")}
            />
            <BookCollection
              page={"/best-sellers"}
              collection={"bestSellers"}
              titleText={bookcollection("bestSeller")}
            />
            <BookCollection
              page={"/award-winning"}
              collection={"awardWinners"}
              titleText={bookcollection("awardWinning")}
            />
            <div className="flex justify-center mt-6">
              <Link
                href={"/allbooks"}
                className="inline-block px-6 py-2 rounded-lg font-medium text-white bg-[#51acec] hover:bg-[#4690ac] transition-colors duration-300 shadow-md m-4 cursor-pointer"
              >
                See More
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
