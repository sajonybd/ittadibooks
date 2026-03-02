

"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Select from "react-select"; // added react-select
import toast from "react-hot-toast";
import Pagination from "@/app/components/Pagination";

export default function AdminBooksPage() {
  const BOOKS_PER_PAGE = 20;
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortField, setSortField] = useState("title.bn");
  const [sortAsc, setSortAsc] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]); // for bulk select
  const [bulkDiscount, setBulkDiscount] = useState(""); // discount input
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collectionsOptions, setCollectionsOptions] = useState([]);

  // filter states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const { data } = await axios.get("/api/admin/books/filters");
        setAuthors(data?.authors || []);
        setCategories(data?.categories || []);
        setCollectionsOptions(data?.collections || []);
      } catch (error) {
        setAuthors([]);
        setCategories([]);
        setCollectionsOptions([]);
      }
    };

    loadFilterOptions();
  }, []);

  const fetchBooks = useCallback(
    async (pageToLoad = currentPage) => {
      setIsLoading(true);
      try {
        const { data } = await axios.get("/api/admin/books/getAllBook", {
          params: {
            page: pageToLoad,
            limit: BOOKS_PER_PAGE,
            search: debouncedSearch,
            sortField,
            sortOrder: sortAsc ? "asc" : "desc",
            category: selectedCategory?.value || "",
            author: selectedAuthor?.value || "",
            collection: selectedCollection?.value || "",
          },
        });

        const fetchedBooks = data?.books || [];
        const pagination = data?.pagination || {};

        setBooks(fetchedBooks);
        setTotalItems(pagination.total || 0);
        setTotalPages(pagination.totalPages || 0);

        if ((pagination.totalPages || 0) > 0 && pageToLoad > pagination.totalPages) {
          setCurrentPage(pagination.totalPages);
        }
      } catch (error) {
        setBooks([]);
        setTotalItems(0);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    },
    [
      BOOKS_PER_PAGE,
      currentPage,
      debouncedSearch,
      sortField,
      sortAsc,
      selectedCategory,
      selectedAuthor,
      selectedCollection,
    ]
  );

  useEffect(() => {
    fetchBooks();
    setSelectedBooks([]);
  }, [fetchBooks]);

  // helper
  const getValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc?.[part], obj) || "";

  const currentBooks = books;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  // 🔹 Select All
  const toggleSelectAll = () => {
    if (selectedBooks.length === currentBooks.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(currentBooks.map((b) => b._id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedBooks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 🔹 Bulk Discount Apply
  const applyBulkDiscount = async () => {
    if (!bulkDiscount) {
      toast.error("Enter discount percentage!");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/books/bulkDiscount`,
        { ids: selectedBooks, discount: bulkDiscount }
      );

      toast.success("Discount applied successfully!");
      setBulkDiscount("");
      setSelectedBooks([]);
      await fetchBooks();
    } catch (error) {
      // // console.error(error);
      toast.error("Failed to apply discount");
    }
  };

 

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/books/delete/${id}`
      );

      if (res.data.success) {
        await fetchBooks();
        setSelectedBook(null);
        toast.success("Book deleted successfully");
      } else {
        toast.error("Failed to delete book");
      }
    } catch (error) {
      // // // console.error("Delete error:", error);
      toast.error("An error occurred while deleting the book");
    }
  };

  async function handleRefresh() {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reloadBooks`, { method: "POST" });
    toast.success("Books cache refreshed!");
  }

  return (
    <div className="lg:p-6  mx-auto p-4">
     <div className="flex justify-between mb-5">
       <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-800">
        Manage Books{" "}
        <span className="text-lg">(Total Books : {totalItems})</span>
      </h2>
      <button onClick={handleRefresh} className="bg-green-400 px-3 rounded-md py-1">Refresh Books</button>
     </div>

      {/* Filters */}
      <div className="flex w-full flex-col lg:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title or author"
          className="border rounded px-3 py-2 flex-grow w-full"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="lg:min-w-[200px] w-full">
          <Select
            options={categories}
            isClearable
            placeholder="Select Category"
            value={selectedCategory}
            onChange={(val) => {
              setSelectedCategory(val);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="lg:min-w-[200px] w-full">
          <Select
            options={authors}
            isClearable
            placeholder="Select Author"
            value={selectedAuthor}
            onChange={(val) => {
              setSelectedAuthor(val);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="lg:min-w-[200px] w-full">
          <Select
            options={collectionsOptions}
            isClearable
            placeholder="Select Collection"
            value={selectedCollection}
            onChange={(val) => {
              setSelectedCollection(val);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Bulk discount */}
      {selectedBooks.length > 0 && (
        <div className="flex lg:flex-row flex-col items-center gap-3 mb-4">
          <input
            type="number"
            placeholder="Discount %"
            value={bulkDiscount}
            onChange={(e) => setBulkDiscount(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button
            onClick={applyBulkDiscount}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Apply Discount to {selectedBooks.length} books
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={
                    selectedBooks.length === currentBooks.length &&
                    currentBooks.length > 0
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-2 cursor-pointer">Cover</th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => toggleSort("title.bn")}
              >
                Title {sortField === "title.bn" ? (sortAsc ? "↑" : "↓") : ""}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => toggleSort("authorBn")}
              >
                Author {sortField === "authorBn" ? (sortAsc ? "↑" : "↓") : ""}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => toggleSort("category")}
              >
                Category {sortField === "category" ? (sortAsc ? "↑" : "↓") : ""}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => toggleSort("discountedPrice")}
              >
                Price (৳){" "}
                {sortField === "discountedPrice" ? (sortAsc ? "↑" : "↓") : ""}
              </th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Loading books...
                </td>
              </tr>
            ) : currentBooks.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No books found.
                </td>
              </tr>
            ) : (
              currentBooks.map((book) => (
                <tr key={book._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(book._id)}
                      onChange={() => toggleSelect(book._id)}
                    />
                  </td>
                  <td className="px-4 py-2 lg:w-[300px]">
                    <Image
                      height={80}
                      width={60}
                      src={book?.cover?.url || "/placeholder.png"} // fallback if url missing
                      alt={book?.title?.bn || "Book cover"}
                      priority
                    />
                  </td>
                  <td className="px-4 py-2 lg:w-[300px]">
                    {getValue(book, "title.bn")}
                  </td>
                  <td className="px-4 py-2">
                    {book.authors?.length > 0 ? (
                      book.authors.map((a) => a.name).join(", ")
                    ) : (
                      <span className="text-red-500">Not Given</span>
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {book.categories?.length > 0 ? (
                      book.categories.map((c) => c.category).join(", ")
                    ) : (
                      <span className="text-red-500">Not Given</span>
                    )}
                  </td>

                  
                  <td className="px-4 py-2">
                    <span className="text-red-500 font-semibold">
                      {book.discountedPrice} ৳
                    </span>{" "}
                    ({book?.discount}%){" "}
                    <span className="font-semibold text-green-600 ">
                      {book?.price ? `${book.price} ৳` : ""}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-center space-x-3">
                    <button
                      onClick={() => setSelectedBook(book)}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/admin/books/editBook/${book?._id}`)
                      }
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        totalItems={totalItems}
        pageSize={BOOKS_PER_PAGE}
        siblingCount={2}
      />

      {/* Modal */}
      {selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4 ">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 relative shadow-lg border-2 border-gray-500">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-3">
              {getValue(selectedBook, "title.bn")}
            </h3>
            <div className="flex gap-4 mb-4">
              <img
                src={selectedBook.cover?.url || selectedBook.imageUrl}
                alt={getValue(selectedBook, "title.bn")}
                className="w-32 h-44 object-cover rounded"
              />
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Publisher:</strong> {selectedBook.publisher || "N/A"}
                </p>
                <p>
                  <strong>Author:</strong>{" "}
                  {selectedBook.authors?.length > 0
                    ? selectedBook.authors.map((a) => a.name).join(", ")
                    : "N/A"}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {selectedBook.categories?.length > 0
                    ? selectedBook.categories.map((c) => c.category).join(", ")
                    : "N/A"}
                </p>
                <p>
                  <strong>Collections:</strong>{" "}
                  {selectedBook.collections?.length > 0
                    ? selectedBook.collections.map((c) => c.label || c.value).join(", ")
                    : "N/A"}
                </p>
                <p>
                  <strong>Price:</strong>{" "}
                  <span className="text-red-500 font-semibold">
                    ৳{selectedBook.discountedPrice ?? "N/A"}
                  </span>{" "}
                  {selectedBook.discount ? `(${selectedBook.discount}%)` : ""}
                  {selectedBook.price ? (
                    <span className="text-green-600 font-semibold ml-2">
                      ৳{selectedBook.price}
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              {getValue(selectedBook, "description.bn") ||
                getValue(selectedBook, "description.en") ||
                "No description available."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
