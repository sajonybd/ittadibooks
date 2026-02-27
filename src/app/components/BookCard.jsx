
"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import CloudinaryImage from "@/app/components/CloudinaryImage";
import axios from "axios";

export default function BookCard({ book }) {
  const { locale } = useParams();
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname();
  const lastPath = pathname.split("/").pop();
  const t = useTranslations("bookCard");

  const downSectionRef = useRef(null);
  const blurOverlayRef = useRef(null);

  const [inWishlist, setInWishlist] = useState(false);
  const [inCart, setInCart] = useState(false);

  const width = typeof window !== "undefined" ? window.innerWidth : 0;

  const handleMouseEnter = () => {
    if (width < 1024) return;
    downSectionRef.current?.classList.remove("hidden");
    blurOverlayRef.current?.classList.remove("hidden");
  };

  const handleMouseLeave = () => {
    if (width < 1024) return;
    downSectionRef.current?.classList.add("hidden");
    blurOverlayRef.current?.classList.add("hidden");
  };

  // Wishlist & Cart Logic (unchanged)
  const handleAddToWishlist = () => {
    const current = parseInt(localStorage.getItem("wishlistCount")) || 0;
    localStorage.setItem("wishlistCount", current + 1);

    const existingBookIds =
      JSON.parse(localStorage.getItem("wishlistBookIds")) || [];
    if (!existingBookIds.includes(book?.bookId)) {
      existingBookIds.push(book?.bookId);
      localStorage.setItem("wishlistBookIds", JSON.stringify(existingBookIds));
    }

    window.dispatchEvent(new Event("wishlistUpdated"));
    setInWishlist(true);
  };

  const handleRemoveFromWishlist = () => {
    const current = parseInt(localStorage.getItem("wishlistCount")) || 0;
    localStorage.setItem("wishlistCount", Math.max(current - 1, 0));

    const existingBookIds =
      JSON.parse(localStorage.getItem("wishlistBookIds")) || [];
    const updatedBookIds = existingBookIds.filter((id) => id !== book?.bookId);
    localStorage.setItem("wishlistBookIds", JSON.stringify(updatedBookIds));

    window.dispatchEvent(new Event("wishlistUpdated"));
    setInWishlist(false);
  };

  const handleAddToCart = () => {
    const current = parseInt(localStorage.getItem("cartCount")) || 0;
    localStorage.setItem("cartCount", current + 1);

    const existingBookIds =
      JSON.parse(localStorage.getItem("cartBookIds")) || [];
    if (!existingBookIds.includes(book?.bookId)) {
      existingBookIds.push(book?.bookId);
      localStorage.setItem("cartBookIds", JSON.stringify(existingBookIds));
    }

    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("openCart"));
    setInCart(true);
  };

  const handleRemoveFromCart = () => {
    const current = parseInt(localStorage.getItem("cartCount")) || 0;
    localStorage.setItem("cartCount", Math.max(current - 1, 0));

    const existingBookIds =
      JSON.parse(localStorage.getItem("cartBookIds")) || [];
    const updatedBookIds = existingBookIds.filter((id) => id !== book?.bookId);
    localStorage.setItem("cartBookIds", JSON.stringify(updatedBookIds));

    window.dispatchEvent(new Event("cartUpdated"));
    setInCart(false);
  };

   

  useEffect(() => {
    const checkWishlist = async () => {
      const book_id = book?.bookId || book?._id;
      if (!book_id) return;

      // 1. Check localStorage first
      const localWishlist = JSON.parse(localStorage.getItem("wishlistBookIds") || "[]");
      if (localWishlist.includes(book_id)) {
        setInWishlist(true);
        return; // found locally, no need to call API
      }

      // 2. If not found locally, check backend (only if logged in)
      if (session?.data?.user?.email) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/check?bookId=${book_id}`
          );
          setInWishlist(!!res.data?.inWishlist);
        } catch (error) {
        }
      }
    };

    checkWishlist();
  }, [session?.data?.user?.email, book?.bookId, book?._id]);

   


  useEffect(() => {
    const checkCart = async () => {
      const book_id = book?.bookId || book?._id;
      if (!book_id) return;

      // 1. Check localStorage first
      const localCart = JSON.parse(localStorage.getItem("cartBookIds") || "[]");
      if (localCart.includes(book_id)) {
        setInCart(true);
        return; // stop here — no need for API call
      }

      // 2. If not found locally, optionally check server (if logged in)
      if (session?.data?.user?.email) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/check?bookId=${book_id}`
          );
          setInCart(!!res.data?.inCart);
        } catch (error) {
        }
      }
    };

    checkCart();
  }, [session?.data?.user?.email, book?.bookId, book?._id]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative w-full h-full overflow-hidden rounded-xl bg-[#e9f5ff] shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
    >
      {/* Discount Badge */}
      {book?.discount > 0 && (
        <span className="absolute right-4 top-4 z-20 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
          {book.discount}% {t("off")}
        </span>
      )}

      {/* Blur Overlay */}
       

      {/* Book Image */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-white flex items-center justify-center p-2">
      <CloudinaryImage
        priority
        width={300}
        height={300}
        src={book.cover?.url || "/placeholder.png"}
        alt={book?.title?.[locale]}
        placeholder="blur"
        blurDataURL="/placeholder.png"
        onClick={() => router.push(`/${locale}/book/${book?._id}`)}
        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110 cursor-pointer"
      />
      </div>

      {/* Book Info */}
      <div className="relative z-20 p-3 h-[120px] lg:h-[130px] flex flex-col justify-between">
        <div>
        <h3
          onClick={() => router.push(`/${locale}/book/${book?._id}`)}
          className="cursor-pointer text-xs lg:text-sm font-bold text-gray-900 hover:text-[#51acec] line-clamp-2 leading-tight"
        >
          {book?.title?.[locale]}
        </h3>

        {/* Authors */}
        {book?.authors && book.authors.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {book.authors.slice(0, 1).map((author, idx) => {
              const names = author.name.includes("/")
                ? author.name.split("/").map((part) => part.trim())
                : [author.name.trim()];
              
              const banglaName = names[0];
              const englishName = names[1] || banglaName;
              const displayInfo = locale === "en" ? englishName : banglaName;

              return (
                <p
                  key={author.uid || idx}
                  onClick={() => {
                    router.push(`/${locale}/authors/${encodeURIComponent(banglaName)}`);
                  }}
                  className="cursor-pointer text-[10px] lg:text-xs font-medium text-gray-500 hover:text-[#51acec] line-clamp-1"
                >
                  {displayInfo}
                </p>
              );
            })}
          </div>
        )}
        </div>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1 lg:gap-2">
            <span className="text-sm lg:text-base font-bold text-red-500">
              ৳{book?.discountedPrice}
            </span>
            <span className="text-[10px] lg:text-xs text-gray-400 line-through">
              ৳{book?.price}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Down Section */}
      <div
        ref={downSectionRef}
        className="hidden absolute bottom-0 left-0 right-0 z-30 rounded-b-xl bg-white/95 px-2 py-2 shadow-md backdrop-blur-sm transition-all duration-300"
      >
        <div className="flex flex-col gap-2">
           <div className="flex items-center justify-between gap-2">
            {/* Wishlist */}
            {inWishlist ? (
              <button
                onClick={handleRemoveFromWishlist}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500 shadow transition hover:scale-105 cursor-pointer"
              >
                ♥
              </button>
            ) : (
              <button
                onClick={handleAddToWishlist}
                hidden={lastPath === "wishlist"}
                title="Add to Wishlist"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 shadow transition hover:scale-105 hover:text-red-500 cursor-pointer"
              >
                ♡
              </button>
            )}

            {/* Cart */}
            {inCart ? (
              <button
                onClick={handleRemoveFromCart}
                className="flex-1 rounded-lg bg-green-500 py-2 text-xs font-bold text-white shadow hover:bg-green-600 transition cursor-pointer"
              >
                {t("removeFromCart")}
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex-1 rounded-lg bg-[#51acec] py-2 text-xs font-bold text-white shadow hover:bg-[#4690ac] transition uppercase cursor-pointer"
              >
                {t("addToCart")}
              </button>
            )}
           </div>
           
           {/* Buy Now */}
           <button
             onClick={() => {
               if(!inCart) handleAddToCart();
               router.push(`/${locale}/cart`);
             }}
             className="w-full rounded-lg bg-orange-500 py-2 text-xs font-bold text-white shadow hover:bg-orange-600 transition uppercase cursor-pointer"
           >
             {t("buyNow") || "Buy Now"}
           </button>
        </div>
      </div>
      {/* Mobile / Small Devices Cart & Wishlist */}
      <div className="lg:hidden px-2 pb-3">
        <div className="flex flex-col gap-2">
          {/* Cart & Wishlist Row */}
          <div className="flex gap-2">
            {inWishlist ? (
              <button
                onClick={handleRemoveFromWishlist}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 shadow cursor-pointer"
              >
                ♥
              </button>
            ) : (
              <button
                onClick={handleAddToWishlist}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[#51acec] shadow cursor-pointer"
              >
                ♡
              </button>
            )}

            {inCart ? (
              <button
                onClick={handleRemoveFromCart}
                className="flex-1 rounded-lg bg-green-500 py-1.5 text-[10px] font-bold text-white shadow cursor-pointer"
              >
                {t("remove")}
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex-1 rounded-lg bg-[#51acec] py-1.5 text-[10px] font-bold text-white shadow cursor-pointer"
              >
                {t("addToCart")}
              </button>
            )}
          </div>

          {/* Buy Now Mobile */}
          <button
            onClick={() => {
              if(!inCart) handleAddToCart();
              router.push(`/${locale}/cart`);
            }}
            className="w-full rounded-lg bg-orange-500 py-1.5 text-[10px] font-bold text-white shadow uppercase cursor-pointer"
          >
            {t("buyNow") || "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
