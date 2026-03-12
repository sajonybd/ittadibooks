 

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import Pagination from "@/app/components/Pagination";

export default function AuthorsPage() {
  const t = useTranslations("authorsPage");
  const { locale } = useParams();

  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const authorsPerPage = 9;
  const [pagination, setPagination] = useState({
    page: 1,
    limit: authorsPerPage,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/list?page=${currentPage}&limit=${authorsPerPage}&query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setAuthors(data?.authors || []);
        setPagination(
          data?.pagination || {
            page: currentPage,
            limit: authorsPerPage,
            total: 0,
            totalPages: 0,
          }
        );
      } catch (err) {
        // // console.error("Error fetching authors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, [currentPage, query]);
 

  const handleSearch = () => {
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
    if (page >= 1 && page <= pagination.totalPages) setCurrentPage(page);
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
      ) : authors.length === 0 ? (
        <p className="text-center">No authors found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-6">
            {authors.map((author, idx) => (
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
                  {locale === "en" ? (author.name || author.nameBn) : (author.nameBn || author.name)}
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

          <Pagination
            currentPage={pagination.page || currentPage}
            totalPages={pagination.totalPages || 0}
            onPageChange={handlePageChange}
            totalItems={pagination.total || 0}
            pageSize={pagination.limit || authorsPerPage}
          />
        </>
      )}
    </div>
  );
}
