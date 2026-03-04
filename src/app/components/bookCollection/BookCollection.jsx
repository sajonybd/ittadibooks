import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import SwiperForBooks from "../SwiperForBooks/SwiperForBooks";
import SkeletonForBookCollection from "../SkeletonForBookCollection/SkeletonForBookCollection";

export default function BookCollection({ titleText, collection, page }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchBooks = async () => {
      if (!collection) return; // <-- ✅ protect the fetch

      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/getbookbycollection/forCollection?collection=${collection}`
        );
        const data = await res.json();
        setBooks(data.books);
      } catch (error) {
        // // // console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [collection]);

  const seemore = useTranslations("seemore");
  return (
    <div className="mt-4 mb-3  h-full">
      <div className="flex items-center justify-between w-full h-full bg-[#51acec] px-5 py-3 rounded-lg mb-4 shadow-lg border-b-2 border-b-[#444444]">
        <h3 className="text-base lg:text-xl font-semibold">{titleText}</h3>
        <button
          onClick={() => {
            router.push(page);
          }}
          className="flex items-center lg:gap-1 cursor-pointer"
        >
          <span className="lg:text-lg text-sm">{seemore("title")}</span>
          <span className="text-[#1f1f1f]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              className="w-4 h-4 lg:w-6 lg:h-6"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14m-6 6l6-6m-6-6l6 6"
              ></path>
            </svg>
          </span>
        </button>
      </div>
      {/* books grid */}

      <div className="">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
            {[...Array(5)].map((_, idx) => (
              <SkeletonForBookCollection key={idx} />
            ))}
          </div>
        ) : (
          <SwiperForBooks books={books} />
        )}
        
      </div>
    </div>
  );
}
