"use client";

import BookCard from "@/app/components/BookCard";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function AuthorDetailsPage() {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id);
console.log("Decoded ID:", decodedId);
  // const locale = useLocale();
  const t = useTranslations("authorDetails");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [author, setAuthor] = useState({});
  const [authorBooks, setAuthorBooks] = useState([]);
  const { locale } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/getDetail/withBn/${decodedId}`
        );
        const data = await res.json();
        if (res.ok) {
          setAuthor(data);
          setFollowerCount(data?.followerCount || 0);
        }
      } catch (error) {
        // // // console.error("Error fetching author:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, []);
 
  useEffect(() => {
    const fetchAuthorBooks = async () => {
      try {
        // const decodedName = decodeURIComponent(author?.nameBn || "");
         
        // if (!decodedName) return; // stop if not ready
        console.log("Fetching books for author:", author.uid);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/getBookWIthBn/${author?.uid}`
        );
        const data = await res.json();
        if (res.ok) {
          setAuthorBooks(data);
        }
      } catch (error) {
        // // console.error("Error fetching author books:", error);
      }
    };


    fetchAuthorBooks();

  }, [author]);

  const handleFollow = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/follow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ authorId: author?._id }), // make sure authorId is available in scope
        }
      );

      const data = await res.json();

      if (res.ok) {
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
      } else {
        // // // console.warn("Follow failed:", data.message || data.error);
      }
    } catch (err) {
      
    }
  };
  const handleUnfollow = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/unfollow`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ authorId: author?._id }), // ensure authorId is valid
        }
      );

      const data = await res.json();

      if (res.ok) {
        setIsFollowing(false);
        setFollowerCount((prev) => Math.max(0, prev - 1)); // prevent negative count
      } else {
        // // // console.warn("Unfollow failed:", data.message || data.error);
      }
    } catch (err) {
     
    }
  };

  useEffect(() => {
    const checkFollowing = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/checkFollowing?authorId=${author._id}`
        );
        const data = await res.json();

        if (res.ok) {
          setIsFollowing(data.isFollowing);
        } else {
          // // // console.warn("Follow check failed:", data.error);
        }
      } catch (err) {
        // // // // console.error("Error checking follow status:", err);
      }
    };
    if (author._id) {
      checkFollowing();
    }
  }, [author._id]);

 
  return (
    <div className="min-h-screen bg-[#e8f2f7] py-10 lg:px-16">
  {loading ? (
    <h1 className="text-3xl font-bold text-gray-800">
     Loading...
    </h1>
  ) : author && Object.keys(author).length > 0 ? (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10">
      <div className="flex flex-col md:flex-row gap-8">
        <Image
          height={180}
          width={180}
          src={author?.imageUrl || "/assets/images/profile/profileForAuthor.png"}
          alt={author.name}
          className="w-40 h-40 object-cover rounded-full border-4 border-[#67bee4]"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">
            {locale === "en" ? author.name : author.nameBn}
          </h1>
          <p className="text-gray-600 mt-2">
            {locale === "en" ? author.description : author.descriptionBn}
          </p>
          <div className="mt-4 flex items-center gap-6">
            <span className="text-gray-700 font-medium">
              {t("followers")}: {followerCount}
            </span>
            <button
              onClick={() => {
                if (!isFollowing) {
                  handleFollow();
                } else {
                  handleUnfollow();
                }
              }}
              className={`px-5 py-2 rounded-xl text-white font-medium transition ${
                isFollowing
                  ? "bg-gray-500"
                  : "bg-[#67bee4] hover:saturate-150"
              }`}
            >
              {isFollowing ? t("following") : t("follow")}
            </button>
          </div>
        </div>
      </div>

      {/* Books */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {locale === "en" ? author.name : author.nameBn}{t("booksBy")} 
        </h2>
        {authorBooks.length === 0 ? (
          <p>No books available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorBooks.map((book, idx) => (
              <div
                key={idx}
                className="bg-[#fffdfd] border-[1px] border-gray-300 rounded-xl shadow p-2 hover:shadow-lg transition"
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10">
      <h1 className="text-3xl font-bold text-gray-800">
       No books found for this author.
      </h1>
    </div>
  )}
</div>
 
  );
}
