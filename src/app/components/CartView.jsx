
"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartView({ handleNext, setCartItems, cartItems }) {
  // const { locale } = useParams();
  const { locale } = useParams();
  // Load from cartBookIds in localStorage, then fetch book details
  useEffect(() => {
    const bookIds = JSON.parse(localStorage.getItem("cartBookIds") || "[]");

    if (bookIds.length === 0) return;

    const fetchBooks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/getBooks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookIds }),
        });

        const data = await response.json();

        // Set default quantity to 1 for all
        const booksWithQty = data.books.map((book) => ({
          ...book,
          quantity: 1,
        }));

        setCartItems(booksWithQty);
        saveToLocalStorage(booksWithQty); // optional: keep synced
      } catch (err) {
        // // // console.error("Failed to load cart:", err);
      }
    };

    fetchBooks();
  }, []);

  const saveToLocalStorage = (items) => {
    const simplified = items.map(({ bookId, quantity }) => ({
      bookId,
      quantity,
    }));
    localStorage.setItem("cartItems", JSON.stringify(simplified));
    localStorage.setItem(
      "cartBookIds",
      JSON.stringify(simplified.map((i) => i.bookId))
    );
    const count = simplified.reduce((sum, i) => sum + i.quantity, 0);
    localStorage.setItem("cartCount", count.toString());
  };

  const handleQuantityChange = (bookId, delta) => {
    const updated = cartItems.map((item) =>
      item.bookId === bookId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setCartItems(updated);
    saveToLocalStorage(updated);
  };

  const handleRemove = (bookId) => {
    const filtered = cartItems.filter((item) => item.bookId !== bookId);
    setCartItems(filtered);
    saveToLocalStorage(filtered);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );

  return (
    <div className="lg:max-w-6xl w-full lg:mx-auto px-4 py-10">
      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      ) : (
        <div className="flex lg:flex-row flex-col w-full gap-6">
          <div className="lg:w-[70%] space-y-6">
            {cartItems.map((item, idx) => (
              <div
                key={item.bookId}
                className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border"
              >
                <Image
                  src={item?.cover?.url}
                  alt={item.title?.[locale] || "Book Cover"}
                  width={100}
                  height={140}
                  className="rounded-md"
                />
                <div className="flex-1 w-full">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.title?.[locale]}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">{item.author}</p>
                  <p className="text-sm text-gray-700 font-semibold">
                    ৳{item.discountedPrice}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                      onClick={() => handleQuantityChange(item.bookId, -1)}
                    >
                      -
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                      onClick={() => handleQuantityChange(item.bookId, 1)}
                    >
                      +
                    </button>
                    <button
                      className="ml-auto text-red-500 hover:underline text-sm"
                      onClick={() => handleRemove(item.bookId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

           
          <div className="bg-white p-6 rounded-xl shadow-md border h-fit lg:w-[30%]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>

            {/* Subtotal */}
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>৳{total}</span>
            </div>

            {/* Total Books / Items */}
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Total Books</span>
              <span>
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>


            <hr className="my-4" />

            {/* Total Amount */}
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>৳{total}</span>
            </div>

            <button
              className="mt-6 w-full bg-[#67bee4] hover:saturate-150 text-white py-2 rounded-xl transition"
              onClick={handleNext}
            >
              Proceed to Checkout
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
