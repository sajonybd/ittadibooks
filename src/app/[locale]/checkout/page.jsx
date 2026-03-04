"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CheckoutView from "@/app/components/CheckoutView";

export default function CheckoutPage() {
  const { locale } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const bookIds = JSON.parse(localStorage.getItem("cartBookIds") || "[]");
        if (!Array.isArray(bookIds) || bookIds.length === 0) {
          setCartItems([]);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/getBooks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookIds }),
        });
        const data = await response.json();

        const localCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
        const booksWithQty = (data?.books || []).map((book) => {
          const local = localCart.find((item) => item.bookId === book.bookId);
          return { ...book, quantity: local?.quantity || 1 };
        });
        setCartItems(booksWithQty);
      } catch (error) {
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f6fa] py-10 px-4 md:px-16">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow animate-pulse">
          <div className="h-8 w-56 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded" />
              <div className="h-20 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f3f6fa] py-16 px-4">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-3">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add books to continue checkout.</p>
          <Link
            href={`/${locale}`}
            className="inline-block bg-[#51acec] hover:bg-[#4690ac] text-white font-medium px-6 py-3 rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return <CheckoutView cartItems={cartItems} />;
}
