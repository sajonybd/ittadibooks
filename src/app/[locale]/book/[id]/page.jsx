

"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import CloudinaryImage from "@/app/components/CloudinaryImage";
import RatingCom from "@/app/components/Rating";
import BookCard from "@/app/components/BookCard";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import axios from "axios";
import { PDFViewer } from "@react-pdf/renderer";
import MyDocument from "@/app/components/MyDocument";
import toast from "react-hot-toast";
 
import { Button } from "@mui/material";
// import PdfViewerComponentNew from "@/app/components/pdfViewer/pdfViewer";

import dynamic from "next/dynamic";

const PdfViewerComponentNew = dynamic(
  () => import("@/app/components/pdfViewer/pdfViewer"),
  { ssr: false }
);

 
 
 

export default function BookDetailPage() {
  const { id } = useParams();
 
  const [showPdf, setShowPdf] = useState(false);
  const [open, setOpen] = useState(false);
  // const locale = useLocale();
  const router = useRouter();
  const session = useSession();
  const { locale } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef(null);
  const t = useTranslations("bookDetails");

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey && e.key === "s") || e.key === "PrintScreen") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  
  useEffect(() => {
     

    async function fetchBook() {
      try {
        setLoading(true);
          
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/book/${id}`
        );
        const data = await res.json();
        setBook(data?.book);
      } catch (error) {
        // // // console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id){

      fetchBook();
    }
  }, [id]);

  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pdf/protectpdf/test`);
        if (!res.ok) throw new Error("PDF not found");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url); // temporary URL for the browser
      } catch (err) {
        console.error(err);
      }
    };

    fetchPdf();

    // Cleanup blob URL on unmount
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  

  // Fetch reviews
  useEffect(() => {
    if (!book?.bookId) return;
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/review/get?bookId=${book.bookId}`
        );
        setReviews(res.data?.reviews || []);
      } catch (error) {
        // // // console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [book?.bookId]);
  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewRating || !reviewText) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/review/add`,
        {
          email: session?.data?.user?.email || "",
          bookId: book?.bookId,
          name: reviewName,
          rating: reviewRating,
          comment: reviewText,
        }
      );
      if (res.data?.review) {
        // setReviews([res.data.review, ...reviews]);
        setReviews((prev) => [res.data.review, ...prev]);
        setReviewName("");
        setReviewRating(0);
        setReviewText("");
      }
    } catch (error) {
      // // // console.error("Error submitting review:", error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      const book_id = book?.bookId || book?._id;
      if (!session?.data?.user?.email || !book_id) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/check?bookId=${book_id}`
        );
        setInWishlist(res.data?.inWishlist || false);
      } catch (error) { }
    };
    checkWishlist();
  }, [session?.data?.user?.email, book?.bookId, book?._id]);

  const handleAddToWishlist = async () => {
    const email = session?.data?.user?.email;
    if (!email) {
      alert("Please login to add books to your wishlist.");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/add`,
        {
          email,
          bookId: book?.bookId,
        }
      );
      if (res.data.message) {
        const current = parseInt(localStorage.getItem("wishlistCount")) || 0;
        localStorage.setItem("wishlistCount", current + 1);
        window.dispatchEvent(new Event("wishlistUpdated"));
        setInWishlist(true);
      }
    } catch (err) { }
  };



  const handleAddToCart = async () => {
    // Update cart count
    const current = parseInt(localStorage.getItem("cartCount")) || 0;
    localStorage.setItem("cartCount", current + 1);

    // Update bookId array in localStorage
    const existingBookIds =
      JSON.parse(localStorage.getItem("cartBookIds")) || [];

    if (!existingBookIds.includes(book?.bookId)) {
      existingBookIds.push(book?.bookId);
      localStorage.setItem("cartBookIds", JSON.stringify(existingBookIds));
    }

    // Trigger update & state
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("openCart"));
    setInCart(true);

  };


  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const book_id = book?.bookId || book?._id;
    if (!book_id) return;

    // Check in localStorage first
    const existingBookIds =
      JSON.parse(localStorage.getItem("cartBookIds")) || [];
    if (existingBookIds.includes(book_id)) {
      setInCart(true);
      return; 
    }

    // If you still want to check from API as fallback
    const checkCart = async () => {
      if (!session?.data?.user?.email) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/check?bookId=${book_id}`
        );
        setInCart(res.data?.inCart || false);
      } catch (error) {
      }
    };
    checkCart();
  }, [session?.data?.user?.email, book?.bookId, book?._id]);

  const [relatedBooks, setRelatedBooks] = useState([]);
  useEffect(() => {
    const categoryName = book?.categories?.[0]?.category;
    if (!categoryName) return;
    const fetchRelatedBooks = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/book/getAll`);
        if (res.data?.success) {
          const filtered = res.data.books.filter(
            (b) => b._id !== book._id && b.categories?.[0]?.category === categoryName
          );
          setRelatedBooks(filtered.slice(0, 8));
        }
      } catch (error) { }
    };
    fetchRelatedBooks();
  }, [book?._id, book?.categories?.[0]?.category]);

  const handleBuyNow = async () => {
    if (!inCart) {
      handleAddToCart();
    }
    router.push("/cart");
  };

  const handleMouseMove = (e) => {
    const bounds = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;
    setPosition({ x, y });
  };



  // Calculate average rating and total reviews dynamically from reviews array
  const totalReviews = reviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews;

  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-gray-600 h-screen">
        Loading...
      </div>
    );
  }
  if (!book) {
    return (
      <div className="text-center py-20 text-xl text-red-600 h-screen">
        Not found
      </div>
    );
  }


  const hadnleShowPdf = () => {
     
    
    setOpen(!open);
  }



  return (
    <div className="px-4 lg:px-20 py-8 font-sans ">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Section */}
        <div className="w-full lg:w-2.5/3 space-y-4">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex flex-col w-full lg:w-1/3">
              <div
                ref={imageRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="w-full shrink-0 overflow-hidden rounded-lg shadow-md"
              >
                <CloudinaryImage
                  src={book.cover?.url}
                  alt={book.title?.bn || book.title?.en}
                  width={260}
                  height={260}
                  className="w-full lg:h-auto transition-transform duration-300"
                />
              </div>
              <div>
                <button onClick={hadnleShowPdf} className="border-2 border-[#51acec] w-full p-2 rounded-lg text-[#326174] hover:bg-[#51acec] hover:text-white mt-4 cursor-pointer">
                  {t("checkitout")}
                </button>

              </div>
              <div>
             {
              open && <PdfViewerComponentNew open={open} setOpen={setOpen} pdfUrl={pdfUrl}/>
             }
               
              </div>
            </div>

            
            <div className="space-y-2 w-full">
              <h1 className="text-2xl mb-5 font-bold text-[#1f1f1f]">
                {book.title?.[locale]}
              </h1>


              {/* Author */}
              {book?.authors?.length > 0 &&
                book.authors.some((a) => a.name?.trim() !== "") && (
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">{t("author")}: </span>
                    {book.authors.map((a, i) => {
                      const [banglaName, englishName] = a.name.includes("/")
                        ? a.name.split("/").map((part) => part.trim())
                        : [a.name.trim(), ""];

                      const displayInfo = locale === "en" ? (englishName || banglaName) : banglaName;

                      return (
                        <span key={i}>
                          <span
                            onClick={() => {
                              if (banglaName)
                                router.push(
                                  `/${locale}/authors/${encodeURIComponent(banglaName)}`
                                );
                            }}
                            className="cursor-pointer hover:text-[#51acec] hover:underline"
                          >
                            {displayInfo}
                          </span>
                          {/* {englishName && ` / ${englishName}`} */}
                          {i < book.authors.length - 1 && ", "}
                        </span>
                      );
                    })}
                  </p>
                )}

              {/* Translator */}
              {book?.translators?.length > 0 &&
                book.translators.some((tr) => tr.name?.trim() !== "") && (
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">{t("translator")}: </span>
                    {book.translators.map((tr, i) => {
                      const names = tr.name.includes("/")
                        ? tr.name.split("/").map((part) => part.trim())
                        : [tr.name.trim()];

                      const banglaName = names[0];
                      const englishName = names[1] || banglaName;
                      const displayInfo = locale === "en" ? englishName : banglaName;

                      return (
                        <span key={i}>
                          <span
                            onClick={() => {
                              if (banglaName)
                                router.push(
                                  `/${locale}/authors/${encodeURIComponent(banglaName)}`
                                );
                            }}
                            className="cursor-pointer hover:text-[#51acec] hover:underline"
                          >
                            {displayInfo}
                          </span>
                          {i < book.translators.length - 1 && ", "}
                        </span>
                      );
                    })}
                  </p>
                )}

              {/* Editor */}
              {book?.editors?.length > 0 &&
                book.editors.some((ed) => ed.name?.trim() !== "" && ed.name?.trim() !== null) && (
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">{t("editor")}: </span>
                    {book.editors.map((ed, i) => {
                      const names = ed.name.includes("/")
                        ? ed.name.split("/").map((part) => part.trim())
                        : [ed.name.trim()];

                      const banglaName = names[0];
                      const englishName = names[1] || banglaName;
                      const displayInfo = locale === "en" ? englishName : banglaName;

                      return (
                        <span key={i}>
                          <span
                            onClick={() => {
                              if (banglaName)
                                router.push(
                                  `/${locale}/authors/${encodeURIComponent(banglaName)}`
                                );
                            }}
                            className="cursor-pointer hover:text-[#51acec] hover:underline"
                          >
                            {displayInfo}
                          </span>
                          {i < book.editors.length - 1 && ", "}
                        </span>
                      );
                    })}
                  </p>
                )}

              {/* Ratings */}
              <div className="mt-3 text-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-500 text-xl">
                    ★ {averageRating.toFixed(1)}
                  </span>
                  <span>
                    {totalReviews} {t("review", { count: totalReviews })}
                  </span>

                  <span
                    className={`font-medium ${book?.availability === "In Stock"
                      ? "text-green-600"
                      : book?.availability === "Stock Out"
                        ? "text-red-600"
                        : "text-gray-500"
                      }`}
                  >
                    {book?.availability === "In Stock" && <>✔ {t("inStok")}</>}
                    {book?.availability === "Stock Out" && <>✖ {t("stockOut")}</>}
                    {book?.availability === "Unavailable" && <>⚠ {t("unavailable")}</>}
                  </span>

                </div>
              </div>
              <div className="mt-1 grid grid-cols-1 gap-x-8 gap-y-0.5 text-base text-gray-700">

                <p>
                  <strong>{t("publisher")}: </strong>
                  {book.publisher ? book.publisher.split("/")[0].trim() : "N/A"}
                </p>


                <p>
                  <strong>{t("publishedDate")}: </strong>
                  {book.publishedDate
                    ? new Date(book.publishedDate).toLocaleDateString("bn-BD", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    : "N/A"}
                </p>

                <p>
                  <strong>{t("isbn")}: </strong> {book.isbn || "N/A"}
                </p>
                <p>
                  <strong>{t("language")}: </strong> {book.language}
                </p>
                <p>
                  <strong>{t("format")}: </strong> {book.format || "N/A"}
                </p>
                <p>
                  <strong>{t("edition")}: </strong> {book.edition || "N/A"}
                </p>
                <p>
                  <strong>{t("pages")}: </strong> {book.pages}
                </p>

                <p>
                  <strong>{t("category")}: </strong>
                  {book?.categories?.length > 0
                    ? `${book.categories[0].category}${book.categories[0].subCategory?.length > 0
                      ? " / " + book.categories[0].subCategory.join(", ")
                      : ""
                    }`
                    : "N/A"}
                </p>

              </div>
              {/* Plain Price & Actions */}
              <div className="my-1 space-y-2">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    ৳ {book.discountedPrice}
                  </h2>
                  {book.discount > 0 && (
                    <span className="text-red-600 font-semibold">
                      {book.discount}% {t("off")}
                    </span>
                  )}
                  {book.price > book.discountedPrice && (
                    <span className="text-gray-500 line-through">
                      ৳ {book.price}
                    </span>
                  )}
                </div>

                {/* <p className="text-sm text-gray-500">{t("vatText")}</p> */}

                <div className="flex flex-wrap gap-2 mt-2">
                  
                    <button
                      onClick={handleAddToCart}
                      className="bg-[#51acec] hover:bg-[#5ca5c5] text-white text-lg font-semibold py-2 px-4 rounded-md w-full lg:w-auto cursor-pointer"
                    >
                      🛒 {t("addToCart")}
                    </button>

                  <button
                    onClick={handleBuyNow}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold py-2 px-4 rounded-md w-full lg:w-auto cursor-pointer"
                  >
                    🚀 {t("purchaseNow")}
                  </button>

                  {inWishlist ? (
                    <span className="text-green-700 font-medium py-2 px-4">
                      ✅ {t("alreadyInWishlist")}
                    </span>
                  ) : (
                    <button
                      onClick={handleAddToWishlist}
                      className="bg-gray-300 shadow-md  text-gray-800 text-lg font-semibold py-2 px-4 rounded-md w-full lg:w-auto cursor-pointer"
                    >
                      ❤️ {t("addToWishlist")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-lg text-gray-700 leading-relaxed mt-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {t("description")}
            </h2>
            <p>{book.description?.[locale]}</p>
          </div>

          {/* Related Books */}
          {relatedBooks.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {t("relatedBooks") || "Related Books"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {relatedBooks.map((b) => (
                  <BookCard key={b._id} book={b} />
                ))}
              </div>
            </div>
          )}

          {/* Ratings */}

          {/* Price (Mobile view) */}
          <div className="p-6 rounded-xl shadow-lg border bg-white space-y-6 lg:hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">
                ৳ {book.discountedPrice}
              </h2>
              {book.discount > 0 && (
                <span className="text-sm text-red-600 font-semibold bg-red-100 px-2 py-1 rounded">
                  {book.discount}% {t("off")}
                </span>
              )}
            </div>
            <p className="text-base text-gray-500 line-through">
              ৳ {book.price}
            </p>
            <p className="text-sm text-gray-500">{t("vatText")}</p>
            <div className="flex flex-col gap-3">
              {inCart ? (
                <button
                  disabled
                  className="bg-gray-400 text-white text-lg font-semibold py-3 rounded-md cursor-not-allowed"
                >
                  {t("purchaseNow")}
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="bg-[#51acec] hover:bg-[#5ca5c5] text-white text-lg font-semibold py-3 rounded-md"
                >
                  🛒 {t("addToCart")}
                </button>
              )}
              <button
                onClick={handleAddToWishlist}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-lg font-semibold py-3 rounded-md flex items-center justify-center gap-2"
              >
                ❤️ {t("addToWishlist")}
              </button>
            </div>
          </div>

          {/* Write a review */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {t("writeReview")}
            </h2>
            <form className="space-y-6" onSubmit={handleSubmitReview}>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  {t("yourName")}
                </label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full border border-gray-400 rounded-md px-4 py-3 focus:ring-blue-300"
                  placeholder={t("yourName")}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t("rating")}
                </label>
                <RatingCom rating={reviewRating} setRating={setReviewRating} />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  {t("writeYourReview")}
                </label>
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full border border-gray-400 rounded-md px-4 py-3 focus:ring-blue-300"
                  placeholder={t("writeYourReviewHere")}
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-[#51acec] hover:bg-[#5ca5c5] text-white font-semibold px-6 py-3 rounded-md"
                >
                  {submittingReview ? "Submitting..." : t("submitReview")}
                </button>
              </div>
            </form>
          </div>

          {/* Display reviews */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {t("customerReviews")}
            </h2>
            {reviews.length === 0 ? (
              <p className="text-gray-600">{t("noReviews")}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-300 p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900">
                        {rev.name}
                      </span>
                      <span className="text-yellow-500 text-lg">
                        {"★".repeat(rev.rating)}
                      </span>
                    </div>
                    <p className="text-gray-700">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}
