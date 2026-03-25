 

"use client";
import React, { useEffect, useState } from "react";
import BrowseSidebar from "./sidebar/Sidebar";
import BookCollection from "./bookCollection/BookCollection";
import Breadcrumbs from "./Breadcrumbs";
import BookCard from "./BookCard";
import Notice from "./Notice/Notice";
import Link from "next/link";
import { useTranslations } from "next-intl";
import VideoSection from "./VideoSection";
import BannerSlider from "./SliderForBooks/SliderForBooksNew";
import Pagination from "./Pagination";
import { buildBookListQuery } from "@/lib/bookListQuery";
import SkeletonForBookCollection from "./SkeletonForBookCollection/SkeletonForBookCollection";

export default function HomeBooks({
  allBooks,
  authors,
  categories,
  collections,
}) {
  const bookcollection = useTranslations("bookCollection");
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
  const [pagedBooks, setPagedBooks] = useState([]);
  const [loadingFilteredBooks, setLoadingFilteredBooks] = useState(false);
  const [hasFetchedFilteredBooks, setHasFetchedFilteredBooks] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: booksPerPage,
    total: 0,
    totalPages: 0,
  });
  const hasActiveFilters =
    filters.authors?.length > 0 ||
    filters.categories?.length > 0 ||
    filters.publishers?.length > 0 ||
    filters.ebookOnly ||
    filters.inStockOnly ||
    sort !== "ALL_BOOKS";

	  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort]);

  useEffect(() => {
    if (!hasActiveFilters) {
      setPagedBooks([]);
      setLoadingFilteredBooks(false);
      setHasFetchedFilteredBooks(false);
      setPagination({
        page: 1,
        limit: booksPerPage,
        total: 0,
        totalPages: 0,
      });
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    const fetchBooks = async () => {
      try {
        setLoadingFilteredBooks(true);
        const query = buildBookListQuery({
          page: currentPage,
          limit: booksPerPage,
          sort,
          authors: filters.authors,
          categories: filters.categories,
          publishers: filters.publishers,
          ebookOnly: filters.ebookOnly,
          inStockOnly: filters.inStockOnly,
	        });
	        const res = await fetch(
	          `${process.env.NEXT_PUBLIC_BASE_URL}/api/book/getbookForFilter?${query}`,
	          { signal: controller.signal }
	        );
	        const data = await res.json();
	        if (cancelled) return;
	        setPagedBooks(data?.books || []);
	        setPagination(
	          data?.pagination || {
            page: currentPage,
            limit: booksPerPage,
            total: 0,
            totalPages: 0,
          }
        );
	    } catch (error) {
	      if (cancelled || error?.name === "AbortError") return;
	      setPagedBooks([]);
	      setPagination({
	        page: currentPage,
	        limit: booksPerPage,
          total: 0,
          totalPages: 0,
        });
	    } finally {
	      if (!cancelled) {
	        setLoadingFilteredBooks(false);
	        setHasFetchedFilteredBooks(true);
	      }
	    }
	  };

	  fetchBooks();
	  return () => {
	    cancelled = true;
	    controller.abort();
	  };
  }, [currentPage, filters, hasActiveFilters, sort]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setHasFetchedFilteredBooks(false);
      setLoadingFilteredBooks(true);
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const setFiltersWithLoading = (next) => {
    setHasFetchedFilteredBooks(false);
    setLoadingFilteredBooks(true);
    setFilters(next);
  };

  const setSortWithLoading = (next) => {
    setHasFetchedFilteredBooks(false);
    setLoadingFilteredBooks(true);
    setSort(next);
  };

  return (
    <>
      {/* Sidebar */}
      <div className="lg:w-72 shrink-0">
	        <div className="sticky top-6">
	          <BrowseSidebar
	            sort={sort}
	            setSort={setSortWithLoading}
	            filters={filters}
	            setFilters={setFiltersWithLoading}
	            authors={authors}
	            categories={categories}
	          />
	        </div>
      </div>

      {/* Main Content */}
      <div className="min-w-0 flex-1">
	        {hasActiveFilters ? (
	          <div>
	            <Breadcrumbs sort={sort} filters={filters} />
	            {loadingFilteredBooks || !hasFetchedFilteredBooks ? (
	              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
	                {[...Array(12)].map((_, idx) => (
	                  <SkeletonForBookCollection key={idx} />
	                ))}
	              </div>
	            ) : pagedBooks.length > 0 ? (
	              <>
	                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
	                  {pagedBooks.map((book) => (
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
        ) : (
          // Default homepage content
          <div>
            {/* <CustomKeenSlider /> */}
            <BannerSlider/>
            <Notice />
            
            <VideoSection />
            <BookCollection
              page={"/ittadi-books"}
              books={collections?.ittadiBooks}
              titleText={bookcollection("ittadiBooks")}
            />
            <BookCollection
              page={"/new-books"}
              books={collections?.newArrivals}
              titleText={bookcollection("newBooks")}
            />
            <BookCollection
              page={"/book-fair-2025"}
              books={collections?.bookfair2025}
              titleText={bookcollection("bookFair")}
            />
            <BookCollection
              page={"/bhumika-book"}
              books={collections?.bhumikaBooks}
              titleText={bookcollection("bhumikaBooks")}
            />
            <BookCollection
              page={"/best-sellers"}
              books={collections?.bestSellers}
              titleText={bookcollection("bestSeller")}
            />
            <BookCollection
              page={"/award-winning"}
              books={collections?.awardWinners}
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
