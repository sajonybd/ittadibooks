

"use client";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Select from "react-select"; // added react-select

const collections = [
  { id: "bookfair2025", label: "Book Fair 2025" },
  { id: "ittadiBooks", label: "Ittadi Books" },
  { id: "bhumikaBooks", label: "Bhumika Books" },
  { id: "awardWinners", label: "Award Winning Books" },
  { id: "newArrivals", label: "New Arrivals" },
  { id: "bestSellers", label: "Best Sellers" },
  { id: "editorChoice", label: "Editor’s Choice" },
  { id: "mustReads", label: "Must Reads" },
];

export default function AdminBooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("title.bn");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]); // for bulk select
  const [bulkDiscount, setBulkDiscount] = useState(""); // discount input
  const { locale } = useParams();
  const [selectedCollection, setSelectedCollection] = useState(null);

  // filter states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = books.length;

  // helper
  const getValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc?.[part], obj) || "";

  
  useEffect(() => {
    const getBooks = async () => {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/books/getAllBook`
      );
      const fetchedBooks = data?.data?.books || [];

      // flatten arrays for easier sort/filter
      const normalizedBooks = fetchedBooks.map((b) => ({
        ...b,
        authorBn: b.authors?.[0]?.name || "", // take first author
        category: b.categories?.[0]?.category || "", // take first category
      }));

      const sortedBooks = [...normalizedBooks].sort((a, b) =>
        getValue(a, "title.bn").localeCompare(getValue(b, "title.bn"), "bn")
      );

      setBooks(sortedBooks);
    };

    getBooks();
  }, []);

 
  const authors = [
    ...new Set(
      books.flatMap(
        (b) => b.authors?.map((a) => a.name?.trim().replace(/\/$/, "")) || []
      )
    ),
  ].map((a) => ({ value: a, label: a }));

  // Categories
  const categories = [
    ...new Set(
      books.flatMap((b) => b.categories?.map((c) => c.category) || [])
    ),
  ].map((c) => ({ value: c, label: c }));

  // Collections (DB already stores {value,label})
  const collectionsOptions = [
    ...new Set(
      books.flatMap((b) => b.collections?.map((col) => col.value) || [])
    ),
  ].map((val) => {
    const label = books
      .flatMap((b) => b.collections || [])
      .find((col) => col.value === val)?.label;
    return { value: val, label };
  });

  const filteredBooks = books.filter((book) => {
    const s = search.toLowerCase();
    const matchesSearch =
      getValue(book, "title.bn").toLowerCase().includes(s) ||
      getValue(book, "authorBn")?.toLowerCase().includes(s);

    
    const matchesCategory = selectedCategory
      ? book.categories?.some((c) => c.category === selectedCategory.value)
      : true;

    const matchesAuthor = selectedAuthor
      ? book.authors?.some((a) => a.name === selectedAuthor.value)
      : true;

    

    const matchesCollection = selectedCollection
      ? book.collections?.some((c) => c.value === selectedCollection.value)
      : true;

    return (
      matchesSearch && matchesCategory && matchesAuthor && matchesCollection
    );
  });

  // 🔹 Sorting
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (!sortField) return 0;
    // Special case → sort by cover existence
    if (sortField === "cover") {
      const aHasCover = a?.cover?.url ? 1 : 0;
      const bHasCover = b?.cover?.url ? 1 : 0;
      return sortAsc ? aHasCover - bHasCover : bHasCover - aHasCover;
    }
    let aVal = getValue(a, sortField);
    let bVal = getValue(b, sortField);

    if (sortField === "discountedPrice") {
      aVal = Number(aVal);
      bVal = Number(bVal);
      return sortAsc ? aVal - bVal : bVal - aVal;
    }

    if (typeof aVal === "string") {
      return sortAsc
        ? aVal.localeCompare(bVal, "bn")
        : bVal.localeCompare(aVal, "bn");
    }

    return 0;
  });

  // pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

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
    if (!bulkDiscount) return alert("Enter discount percentage!");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/books/bulkDiscount`,
        { ids: selectedBooks, discount: bulkDiscount }
      );

      alert("Discount applied successfully!");
      setBulkDiscount("");
      setSelectedBooks([]);

      // refresh
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/books/getAllBook`
      );
      setBooks(data?.data?.books || []);
    } catch (error) {
      // // console.error(error);
      alert("Failed to apply discount");
    }
  };

 

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/books/delete/${id}`
      );

      if (res.data.success) {
        // Remove the book from state after successful deletion
        setBooks((prev) => prev.filter((b) => b._id !== id));
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
    alert("Books cache refreshed!");
  }

  return (
    <div className="lg:p-6  mx-auto p-4">
     <div className="flex justify-between mb-5">
       <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-800">
        Manage Books{" "}
        <span className="text-lg">(Total Books : {books.length})</span>
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
            {currentBooks.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
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
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/admin/books/editBook/${book?._id}`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="text-red-600 hover:underline"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

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
              <div>
                <p>
                  <strong>Author:</strong>{" "}
                  {selectedBook.authorBn ||
                    getValue(selectedBook, "author") ||
                    selectedBook.author}
                </p>
                <p>
                  <strong>Category:</strong> {selectedBook.category}
                </p>
                <p>
                  <strong>Price:</strong> ৳{selectedBook.discountedPrice}
                </p>
              </div>
            </div>
            <p>{getValue(selectedBook, "description.bn")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
