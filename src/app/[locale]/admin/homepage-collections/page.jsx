


"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function HomepageCollectionsAdmin() {
  const [allBooks, setAllBooks] = useState([]); // master list
  const [books, setBooks] = useState([]); // currently shown list (filtered or subset)
  const [collections, setCollections] = useState({}); // homepage collections mapping
  const [selectedCollection, setSelectedCollection] = useState("allBooks");
  const [selectedBooks, setSelectedBooks] = useState([]); // list of bookIds selected for the collection
  const [search, setSearch] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  const collectionOptions = [
    { id: "allBooks", label: "📚 All Books" },
    { id: "bookfair2025", label: "Book Fair 2025" },
    { id: "ittadiBooks", label: "Ittadi Books" },
    { id: "bhumikaBooks", label: "Bhumika Books" },
    { id: "awardWinners", label: "Award Winning Books" },
    { id: "newArrivals", label: "New Arrivals" },
    { id: "bestSellers", label: "Best Sellers" },
    { id: "editorChoice", label: "Editor’s Choice" },
    { id: "mustReads", label: "Must Reads" },
  ];

  // initial fetch
  useEffect(() => {
    fetchBooks();
    fetchCollections();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/books/getAllBook`);
      let fetched = res.data?.books || [];
      // sort by Bengali title if present
      fetched = fetched.sort((a, b) => (a?.title?.bn || "").localeCompare(b?.title?.bn || "", "bn") || 0);
      setAllBooks(fetched);
      setBooks(fetched);
    } catch (err) {
      // // console.error(err);
      toast.error("Failed to fetch books");
    }
  };

  const fetchCollections = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/homepage-collections`);
      // expecting something like: { collections: { collectionId: [bookId,...], ... } }
      setCollections(res.data?.collections || {});
    } catch (err) {
      // // console.error(err);
      toast.error("Failed to fetch collections");
    }
  };

  // Whenever selectedCollection changes, update view:
  useEffect(() => {
    setCurrentPage(1);
    setSearch("");
    setIsEditMode(false);
    setSelectedBooks([]); // reset selected until we load actual saved list or user toggles

    if (selectedCollection === "allBooks") {
      setBooks(allBooks);
      return;
    }

    // By default (when just selected from dropdown), show books that have the collection in their book.collections array
    const filtered = allBooks.filter((b) =>
      b.collections?.some((c) => c.value === selectedCollection)
    );
    setBooks(filtered);
  }, [selectedCollection, allBooks]);

  // Filter view using search
  const filteredBooks = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return books;
    return books.filter((book) => (book.title?.bn || "").toLowerCase().includes(term));
  }, [books, search]);

  // Pagination helpers
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage);

  const allSelectedOnPage = paginatedBooks.length > 0 && paginatedBooks.every((b) => selectedBooks.includes(b.bookId));

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = paginatedBooks.map((b) => b.bookId);
      setSelectedBooks((prev) => [...new Set([...prev, ...allIds])]);
    } else {
      const pageIds = paginatedBooks.map((b) => b.bookId);
      setSelectedBooks((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleToggleBook = (bookId) => {
    setSelectedBooks((prev) => (prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]));
  };

  // Save collection to backend
  const handleSave = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/homepage-collections/save`, {
        collectionId: selectedCollection,
        selectedBooks,
      });
      toast.success("✅ Collection updated successfully!");
      setIsEditMode(false);
      // refresh collections mapping
      fetchCollections();
      // refresh view for the collection
      if (selectedCollection === "allBooks") {
        setBooks(allBooks);
      } else {
        // after save, show filtered books based on saved selection
        const selectedSet = new Set(selectedBooks);
        const newView = allBooks.filter((b) => selectedSet.has(b.bookId));
        setBooks(newView);
      }
    } catch (err) {
      // // console.error(err);
      toast.error("Failed to save collection");
    }
  };

  // Delete (remove book from the selected collection)
  const handleDelete = async (bookId) => {
    try {
      const updated = selectedBooks.filter((id) => id !== bookId);
      setSelectedBooks(updated);
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/homepage-collections/save`, {
        collectionId: selectedCollection,
        selectedBooks: updated,
      });
      toast.success("🗑️ Book removed from collection");
      fetchCollections();
      // update UI: remove that book from current view
      setBooks((prev) => prev.filter((b) => b.bookId !== bookId));
    } catch (err) {
      // // console.error(err);
      toast.error("Failed to remove book");
    }
  };



  const handleEditClick = () => {
    if (selectedCollection === "allBooks") return;

    if (isEditMode) {
      // Cancel edit: restore view to current collection
      const filtered = allBooks.filter((b) =>
        b.collections?.some((c) => c.value === selectedCollection)
      );
      setBooks(filtered);

      const savedIds = collections?.[selectedCollection] || [];
      setSelectedBooks(savedIds);

      setIsEditMode(false);
      setCurrentPage(1);
      toast("✖️ Edit cancelled, showing collection books");
      return;
    }

    // Enter edit mode
    // All books that belong to this collection
    const collectionBooks = allBooks.filter((b) =>
      b.collections?.some((c) => c.value === selectedCollection)
    );

    // Already saved books
    const savedIds = collections?.[selectedCollection] || [];

    setBooks(collectionBooks);       // show all books in this collection
    setSelectedBooks(savedIds);      // mark the already saved ones
    setIsEditMode(true);
    setCurrentPage(1);

    toast.success("✏️ Edit mode: showing all collection books, already selected ones are checked");
  };








  const handleShowSelectedBooks = async () => {
    if (selectedCollection === "allBooks") {
      setBooks(allBooks);
      setSelectedBooks([]);
      toast("Showing all books");
      return;
    }

    try {
      // Ensure collections are fetched
      if (!collections || Object.keys(collections).length === 0) {
        await fetchCollections();
      }

      // Get saved book IDs for this selected collection
      const savedIds = collections?.[selectedCollection] || [];

      // Filter books to only show the selected ones
      const selectedSet = new Set(savedIds);
      const subset = allBooks.filter((b) => selectedSet.has(b.bookId));

      setBooks(subset);
      setSelectedBooks(savedIds);
      setIsEditMode(false);
      setCurrentPage(1);

    } catch (err) {
      // // console.error(err);
      toast.error("Failed to fetch saved collection");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🏠 Homepage Collections</h2>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <select
          className="border p-2 rounded w-full md:w-1/3"
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
        >
          {collectionOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="🔍 বই খুঁজুন..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded p-2 w-full md:w-1/3"
        />

        <div className="flex gap-2 w-full md:w-auto">
          {selectedCollection !== "allBooks" && (
            <>
              <button
                onClick={handleEditClick}
                className={`px-4 py-2 rounded ${isEditMode ? "bg-gray-500 text-white" : "bg-yellow-500 text-white hover:bg-yellow-600"
                  }`}
              >
                {isEditMode ? "Cancel Edit" : "✏️ Edit Collection"}
              </button>

              <button
                onClick={handleShowSelectedBooks}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                📄 Show Selected Books
              </button>
            </>
          )}

          {selectedCollection === "allBooks" && (
            <button
              onClick={() => {
                setBooks(allBooks);
                setIsEditMode(false);
                setSelectedBooks([]);
                toast("Showing all books");
              }}
              className="px-4 py-2 rounded bg-gray-200"
            >
              Reset View
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg mb-6">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              {isEditMode && (
                <th className="p-2 border-r w-10 text-center">
                  <input type="checkbox" checked={allSelectedOnPage} onChange={handleSelectAll} />
                </th>
              )}
              <th className="p-2 border-r text-left">বইয়ের নাম</th>
              <th className="p-2 border-r text-left">লেখক</th>
              <th className="p-2 border-r text-left">প্রকাশক</th>
              <th className="p-2 border-r text-center">মূল্য</th>
              {selectedCollection !== "allBooks" && !isEditMode && <th className="p-2 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedBooks.length > 0 ? (
              paginatedBooks.map((book, idx) => (
                <tr
                  key={book.bookId || idx}
                  className={`border-b hover:bg-gray-50 ${selectedBooks.includes(book.bookId) ? "bg-green-50" : ""}`}
                >
                  {isEditMode && (
                    <td className="p-2 border-r text-center">
                      <input type="checkbox" checked={selectedBooks.includes(book.bookId)} onChange={() => handleToggleBook(book.bookId)} />
                    </td>
                  )}
                  <td className="p-2 border-r">{book.title?.bn || "—"}</td>
                  <td className="p-2 border-r">{book.authors?.[0]?.name || "—"}</td>
                  <td className="p-2 border-r text-center">{book.publisher || ""}</td>
                  <td className="p-2 border-r text-center">৳{book.discountedPrice || "—"}</td>
                  {selectedCollection !== "allBooks" && !isEditMode && (
                    <td className="p-2 text-center">
                      <button onClick={() => handleDelete(book.bookId)} className="text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isEditMode ? "5" : "4"} className="text-center p-4">
                  কোনো বই পাওয়া যায়নি
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex mb-6 justify-center mt-6 space-x-2">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
          Prev
        </button>

        {(() => {
          const pagesToShow = [];
          const totalToShow = 5;
          let start = Math.max(1, currentPage - 2);
          let end = Math.min(totalPages, start + totalToShow - 1);

          if (end - start < totalToShow - 1) {
            start = Math.max(1, end - totalToShow + 1);
          }
          if (start > 1) pagesToShow.push(1);
          if (start > 2) pagesToShow.push("...");

          for (let i = start; i <= end; i++) pagesToShow.push(i);

          if (end < totalPages - 1) pagesToShow.push("...");
          if (end < totalPages) pagesToShow.push(totalPages);

          return pagesToShow.map((page, idx) =>
            page === "..." ? (
              <span key={idx + 1} className="px-2 text-gray-500">
                ...
              </span>
            ) : (
              <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-300"}`}>
                {page}
              </button>
            )
          );
        })()}

        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
          Next
        </button>
      </div>

      {/* Save Button */}
      {isEditMode && (
        <div className="text-center">
          <button onClick={handleSave} className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            💾 Save Changes to {collectionOptions.find((c) => c.id === selectedCollection)?.label}
          </button>
        </div>
      )}
    </div>
  );
}
