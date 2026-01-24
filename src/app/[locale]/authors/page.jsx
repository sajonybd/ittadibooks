 

"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function AuthorsPage() {
  const t = useTranslations("authorsPage");
  const { locale } = useParams();

  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const authorsPerPage = 9;
  const totalPages = Math.ceil(results.length / authorsPerPage);

  const paginatedAuthors = useMemo(() => {
    const start = (currentPage - 1) * authorsPerPage;
    const end = start + authorsPerPage;
    return results.slice(start, end);
  }, [results, currentPage]);

  // Fetch authors
  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/getAll`
        );
        const data = await res.json();

        // Sort by Bangla name
        const sorted = [...data.authors].sort((a, b) =>
          (a.nameBn || "").localeCompare(b.nameBn || "", "bn")
        );

        setAuthors(sorted);
        setResults(sorted);
      } catch (err) {
        // // console.error("Error fetching authors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);
 

  const handleSearch = () => {
    const rawQuery = query;
    const lowerQuery = rawQuery.toLowerCase();

    if (!rawQuery) {
      setResults(authors);
      setCurrentPage(1);
      return;
    }

    const filtered = authors.filter((author) => {
      const nameEn = (author.name || "").toLowerCase(); // English
      const nameBn = author.nameBn || ""; // Bangla

      return (
        nameEn.includes(lowerQuery) || // check English
        nameBn.includes(rawQuery) // check Bangla
      );
    });

    setResults(filtered);
    setCurrentPage(1);
  };

  // Follow / Unfollow
  const handleFollow = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/follow`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authorId: id }),
        }
      );
      if (res.ok) {
        setAuthors((prev) =>
          prev.map((a) => (a._id === id ? { ...a, isFollowing: true } : a))
        );
        setResults((prev) =>
          prev.map((a) => (a._id === id ? { ...a, isFollowing: true } : a))
        );
      }
    } catch (err) {}
  };

  const handleUnfollow = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/unfollow`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authorId: id }),
        }
      );
      if (res.ok) {
        setAuthors((prev) =>
          prev.map((a) => (a._id === id ? { ...a, isFollowing: false } : a))
        );
        setResults((prev) =>
          prev.map((a) => (a._id === id ? { ...a, isFollowing: false } : a))
        );
      }
    } catch (err) {}
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">{t("title")}</h1>

      {/* Search */}
      <div className="flex justify-center mb-6 gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="px-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-[#51acec] text-white rounded-lg"
        >
          {t("search")}
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-center">No authors found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-6">
            {paginatedAuthors.map((author, idx) => (
              <div
                key={idx}
                className="bg-[#d8d7d7] shadow-md rounded-xl p-4 text-center"
              >
                <Image
                  height={128}
                  width={128}
                  src={
                    author?.imageUrl ||
                    "/assets/images/profile/profileForAuthor.png"
                  }
                  alt={author.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="lg:text-xl text-sm font-semibold">
                  {/* {locale === "en" ? author.nameEn || author.name : author.name} */}
                  {author.nameBn}
                </h3>
                <p className="text-gray-500 text-sm mt-1 mb-4 line-clamp-1 font-semibold">
                  {locale === "en" ? author.description : author.descriptionBn}
                </p>

                <div className="flex lg:flex-row flex-col justify-center gap-4">
                  <Link
                    href={`/authors/${author.nameBn}`}
                    className="px-4 py-2 bg-[#67bee4] text-white rounded-lg hover:saturate-150 lg:text-base text-sm"
                  >
                    {t("viewDetails")}
                  </Link>
                  <button
                    onClick={() =>
                      !author.isFollowing
                        ? handleFollow(author._id)
                        : handleUnfollow(author._id)
                    }
                    className={`px-5 py-2 lg:text-base text-sm rounded-lg text-white font-medium transition ${
                      author.isFollowing
                        ? "bg-gray-500"
                        : "bg-[#67bee4] hover:saturate-150"
                    }`}
                  >
                    {author.isFollowing ? t("following") : t("follow")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                {t("prev")}
              </button>

              {/* First page */}
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
                  (page) => page >= currentPage - 2 && page <= currentPage + 2
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

              {/* Last page */}
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

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                {t("next")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
