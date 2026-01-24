
"use client";

import { useEffect, useState } from "react";
import BookCard from "@/app/components/BookCard";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncWishlist = async () => {
      try {
        setLoading(true);

        // 1️⃣ Get book IDs from localStorage
        const localBookIds = JSON.parse(localStorage.getItem("wishlistBookIds")) || [];

        if (localBookIds.length === 0) {
          setWishlist([]);
          return;
        }

        // 2️⃣ Fetch book details from API based on IDs
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/getBooksByIds`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookIds: localBookIds }),
          }
        );
        const data = await res.json();

        // 3️⃣ Update wishlist state
        setWishlist(data?.books || []);
      } catch (error) {
        // // console.error("Failed to sync wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    syncWishlist();
  }, []);

  const removeFromWishlist = (id) => {
    // 1️⃣ Remove from state
    setWishlist((prev) => prev.filter((item) => item._id !== id));

    // 2️⃣ Remove from localStorage
    const existingBookIds = JSON.parse(localStorage.getItem("wishlistBookIds")) || [];
    const updatedBookIds = existingBookIds.filter((bookId) => bookId !== id);
    localStorage.setItem("wishlistBookIds", JSON.stringify(updatedBookIds));

    // 3️⃣ Optionally, sync with API (if needed)
    // await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/remove`, {...})
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {loading ? (
        <p className="text-gray-500">Loading wishlist...</p>
      ) : wishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {wishlist.map((book) => (
            <div key={book?._id} className="border-2 border-gray-300 rounded-lg">
              <BookCard book={book} />
              <button
                className="text-red-500 mt-2"
                onClick={() => removeFromWishlist(book._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
