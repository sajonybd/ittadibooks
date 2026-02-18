"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import LocaleSwitcher from "./LocaleSwitcher";
import { gsap } from "@/lib/gsap";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";

export default function NavBarClient({books}) {
 
  const { locale } = useParams();
 
  const session = useSession();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = value.toLowerCase();

    const filteredBooks = books.filter((book) => {
      // Helper: clean up author/translator/editor names
      const cleanText = (txt) =>
        txt ? txt.replace(/\/\s*undefined/i, "").trim() : "";

      return (
        // English title search
        (book.title?.en && book.title.en.toLowerCase().includes(lowerQuery)) ||
        // Bangla title search (no lowercase needed)
        (book.title?.bn && book.title.bn.includes(value.trim())) ||
        // Author search
        (Array.isArray(book.authors) &&
          book.authors.some((a) => {
            const name = cleanText(a.name);
            return (
              (name && name.toLowerCase().includes(lowerQuery)) || // English match
              (name && name.includes(value.trim())) // Bangla match
            );
          })) ||
        // Translator search
        (Array.isArray(book.translators) &&
          book.translators.some((t) => {
            const name = cleanText(t.name);
            return (
              (name && name.toLowerCase().includes(lowerQuery)) ||
              (name && name.includes(value.trim()))
            );
          })) ||
        // Editor search
        (Array.isArray(book.editors) &&
          book.editors.some((e) => {
            const name = cleanText(e.name);
            return (
              (name && name.toLowerCase().includes(lowerQuery)) ||
              (name && name.includes(value.trim()))
            );
          }))
      );
    });

    setResults(filteredBooks);
  }

  function handleSelect(book) {
    setResults([]);
    setQuery("");
    router.push(`/${locale}/book/${book._id}`);
  }

  const pathname = usePathname();
  const pathArray = pathname.split("/");
 
  const lastPath = pathname.split("/").pop();

  const router = useRouter();
  const t = useTranslations("Navbar");
  const t2 = useTranslations("NavLinks");
  const t3 = useTranslations("authors");
  const t4 = useTranslations("categories");
  const seemore = useTranslations("seemore");
  const [lang, setLang] = useState(locale);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const t5 = useTranslations("bookDetails");
  useEffect(() => {
    setLang(locale);
  }, [locale]);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const getAuthors = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/getAll/navbar`
      );
      const data = await res.json();
      if (res.ok) {
        setAuthors(data?.authors);
      }
    };
    getAuthors();
  }, []);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const getcategories = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/getAll`
      );
      const data = await res.json();

      if (res.ok) {
        setCategories(data);
      }
    };
    getcategories();
  }, []);

  
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    const button = document.getElementById("authorButton");
    const authorDivSection = document.getElementById("authorSection");
    const authorDiv = document.getElementById("authorDiv");
    if (!button || !authorDiv || !authorDivSection) return;

    button.addEventListener("mouseenter", () => {
      authorDivSection.classList.remove("hidden");
    });
    authorDivSection.addEventListener("mouseenter", () => {
      authorDivSection.classList.remove("hidden");
    });
    authorDivSection.addEventListener("mouseleave", () => {
      authorDivSection.classList.add("hidden");
    });
    button.addEventListener("mouseleave", () => {
      authorDivSection.classList.add("hidden");
    });
  }, []);



  

  useEffect(() => {
    const loadCart = async () => {
      const bookIds = JSON.parse(localStorage.getItem("cartBookIds") || "[]");

      if (bookIds.length === 0) {
        setCartItems([]);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/getBooks`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookIds }),
          }
        );

        const data = await response.json();
        const booksWithQty = data.books.map((book) => ({
          ...book,
          quantity: 1,
        }));

        setCartItems(booksWithQty);
        saveToLocalStorage(booksWithQty); // optional
      } catch (err) {
        // // // console.error("Failed to load cart:", err);
      }
    };

    // 🔹 Run once initially
    loadCart();

    // 🔹 Run again whenever BookCard dispatches the event
    const handleCartUpdate = () => {
      loadCart();
    };

    // Listen for "cartUpdated" from BookCard
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Cleanup
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Category section hover effect
  useEffect(() => {
    const button = document.getElementById("categoryButton");
    const categoryDivSection = document.getElementById("categorySection");
    const categoryDiv = document.getElementById("categoryDiv");
    if (!button || !categoryDivSection || !categoryDiv) return;

    button.addEventListener("mouseenter", () => {
      categoryDivSection.classList.remove("hidden");
    });
    categoryDivSection.addEventListener("mouseenter", () => {
      categoryDivSection.classList.remove("hidden");
    });
    categoryDivSection.addEventListener("mouseleave", () => {
      categoryDivSection.classList.add("hidden");
    });
    button.addEventListener("mouseleave", () => {
      categoryDivSection.classList.add("hidden");
    });
  }, []);

  useEffect(() => {
    const menuButton = document.getElementById("menuButton");
    const sideMenu = document.getElementById("sidemenu");
    const crossButton = document.getElementById("crossButton");
    if (!menuButton || !sideMenu || !crossButton) return;
    menuButton.addEventListener("click", () => {
      gsap.to(sideMenu, {
        left: "0%",
        duration: 0.5,
        ease: "power2.inOut",
      });
    });
    crossButton.addEventListener("click", () => {
      gsap.to(sideMenu, {
        left: "-100%",
        duration: 0.5,
        ease: "power2.inOut",
      });
    });
  }, []);
  useEffect(() => {
    const menuButtonCart = document.getElementById("menuButtonCart");
    const sideMenuCart = document.getElementById("sidemenuCart");
    const crossButtonCart = document.getElementById("crossButtonCart");
    if (!menuButtonCart || !sideMenuCart || !crossButtonCart) return;
    menuButtonCart.addEventListener("click", () => {
      gsap.to(sideMenuCart, {
        right: "0%",
        duration: 0.5,
        ease: "power2.inOut",
      });
    });
    crossButtonCart.addEventListener("click", () => {
      gsap.to(sideMenuCart, {
        right: "-100%",
        duration: 0.5,
        ease: "power2.inOut",
      });
    });
  }, []);

  useEffect(() => {
    const authorButton = document.getElementById("authorButtonsm");
    const authorDivsm = document.getElementById("authorDivsm");
    const authorSectionsm = document.getElementById("authorSectionsm");
    if (!authorButton || !authorDivsm || !authorSectionsm) return;

    authorButton.addEventListener("click", () => {
      authorDivsm.classList.toggle("hidden");
      authorSectionsm.classList.toggle("hidden");
    });
  }, []);

  // Category section for small devices
  useEffect(() => {
    const categoryButton = document.getElementById("categoryButtonsm");
    const categoryDivsm = document.getElementById("categoryDivsm");
    const categorySectionsm = document.getElementById("categorySectionsm");
    if (!categoryButton || !categoryDivsm || !categorySectionsm) return;

    categoryButton.addEventListener("click", () => {
      categoryDivsm.classList.toggle("hidden");
      categorySectionsm.classList.toggle("hidden");
    });
  }, []);

  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const local = localStorage.getItem("wishlistCount");
    if (local) {
      setWishlistCount(parseInt(local));
    } else {
      fetchCountFromServer();
    }

    const handleWishlistChange = () => {
      const count = parseInt(localStorage.getItem("wishlistCount")) || 0;
      setWishlistCount(count);
    };

    window.addEventListener("wishlistUpdated", handleWishlistChange);
    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistChange);
    };
  }, [session]);

  const fetchCountFromServer = async () => {
    if (!session?.data?.user?.email) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/count?email=${session?.data?.user?.email}`
      );
      const count = res.data.count;

      localStorage.setItem("wishlistCount", count.toString());
      setWishlistCount(count);
    } catch (err) {
      // // // console.error("Failed to fetch wishlist count:", err);
    }
  };

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const local = localStorage.getItem("cartCount");
    if (local) {
      setCartCount(parseInt(local));
    } else {
      fetchCartCountFromServer();
    }

    const handleCartChange = () => {
      const count = parseInt(localStorage.getItem("cartCount")) || 0;
      setCartCount(count);
    };

    window.addEventListener("cartUpdated", handleCartChange);
    return () => {
      window.removeEventListener("cartUpdated", handleCartChange);
    };
  }, [session]);

  const fetchCartCountFromServer = async () => {
    if (!session?.data?.user?.email) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/count?email=${session?.data?.user?.email}`
      );
      const count = res.data.count;

      localStorage.setItem("cartCount", count.toString());
      setCartCount(count);
    } catch (err) {
      // // // console.error("Failed to fetch cart count:", err);
    }
  };
  const handleRemoveFromCart = (bookId) => {
    const current = parseInt(localStorage.getItem("cartCount")) || 0;
    localStorage.setItem("cartCount", Math.max(current - 1, 0));

    const existingBookIds =
      JSON.parse(localStorage.getItem("cartBookIds")) || [];
    const updatedBookIds = existingBookIds.filter((id) => id !== bookId);
    localStorage.setItem("cartBookIds", JSON.stringify(updatedBookIds));

    window.dispatchEvent(new Event("cartUpdated"));

  };

 
  if (pathArray.includes("admin")) return <></>;
  return (
    <>
      <div className="xl:px-16 2xl:px-32 md:px-10 px-4 w-full bg-[#F9FAFB] shadow-md  top-0 z-[5000000000]">
        {/* upper section */}
        <div className="hidden lg:flex w-full items-center justify-between  py-3 ">
          {/* large device */}
          {/* navlogo */}
          <Link
            href="/"
            className="hidden lg:flex gap-1 items-center cursor-pointer"
          >
            <Image
              width={100}
              height={100}
              src={"/assets/images/logo/logo.png"}
              alt="ittadi books"
              className="bg-transparent drop-shadow-lg"
            />
            <div>
              <h3 className="font-semibold text-[#51acec] text-lg lg:text-xl xl:text-2xl 2xl:text-2xl title-main">
                {t("title")}
              </h3>
            </div>
          </Link>
          {/* search */}
          <div className="hidden lg:flex h-[45px] relative">
            <input
              type="text"
              name="book"
              id=""
              onChange={handleChange}
              placeholder={`${t("searchPlaceholder")}`}
              className="border-[1.5px] border-r-0 border-[#51acec] px-4 py-1 focus:outline-0 xl:w-[300px] 2xl:w-[400px] rounded-l-lg h-full "
            />
            {results.length > 0 && (
               
              <ul className="absolute z-10 left-0 right-0 top-12 max-h-60 overflow-auto rounded-b-lg bg-white border border-gray-300 shadow-lg">
                {results.map((book) => (
                  <li
                    key={book.bookId}
                    onClick={() => handleSelect(book)}
                    className="flex flex-col justify-center px-4 py-3 cursor-pointer transition duration-200 hover:bg-[#51acec] hover:text-white group relative"
                  >
                    <span className="font-semibold text-gray-800 group-hover:text-white">
                      {book.title?.[locale] || "Untitled"}
                    </span>
                    <span className="text-sm text-gray-500 group-hover:text-gray-200">
                      {book.authors?.map((a) => a.name).join(", ") || "Unknown"}
                    </span>
                    {/* Optional: small arrow on hover */}
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white">
                      ➔
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <button
              aria-label="search"
              className="flex justify-center items-center bg-[#51acec]  w-14 rounded-r-lg hover:saturate-150 duration-200 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M10.77 18.3a7.53 7.53 0 1 1 7.53-7.53a7.53 7.53 0 0 1-7.53 7.53m0-13.55a6 6 0 1 0 6 6a6 6 0 0 0-6-6"
                ></path>
                <path
                  fill="white"
                  d="M20 20.75a.74.74 0 0 1-.53-.22l-4.13-4.13a.75.75 0 0 1 1.06-1.06l4.13 4.13a.75.75 0 0 1 0 1.06a.74.74 0 0 1-.53.22"
                ></path>
              </svg>
            </button>
          </div>

          {/* cart,wishlist,login */}
          <div className="hidden lg:flex gap-2 lg:gap-5">
            {/* social icon */}
             <div className="flex justify-center items-center gap-3">
              {session?.data && session?.data?.user?.role === "admin" && (
                <Link href={`/${locale}/admin`} className="text-[#51acec] font-semibold cursor-pointer">
                  Admin Page
                </Link>
              )}
            </div>
            {/* language switch */}
            <LocaleSwitcher />

            {/* wishlist */}
            <div
              onClick={() => {
                router.push("/user/wishlist");
              }}
              className="relative flex items-center p-1 cursor-pointer"
            >
              <button
                onClick={() => router.push("/user/wishlist")}
                aria-label="wishlst"
                className="cursor-pointer"
              >
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={28}
                  height={28}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M19.285 12.645a3.8 3.8 0 0 0-5.416-5.332q-.288.288-.732.707l-.823.775l-.823-.775q-.445-.42-.733-.707a3.8 3.8 0 0 0-5.374 0c-1.468 1.469-1.485 3.844-.054 5.32l6.984 6.984l6.97-6.972zm-14.75-6.18a5 5 0 0 1 7.072 0q.273.274.707.682q.432-.408.707-.683a5 5 0 0 1 7.125 7.017l-7.125 7.126a1 1 0 0 1-1.414 0L4.48 13.48a5 5 0 0 1 .055-7.017z"
                  ></path>
                </svg>
              </button>
              <span className=" absolute  font-semibold right-0 text-sm top-1 bg-red-500 rounded-full w-4 h-4 text-white flex justify-center items-center">
                {wishlistCount}
              </span>
            </div>
            
            {/* cart */}
            <div
              onClick={() => setIsCartOpen(true)} // open sidebar instead of router.push
              className="relative flex items-center p-1 cursor-pointer"
            >
              <button aria-label="cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 56 56"
                  className="hover:text-[#51acec] duration-150"
                >
                  <path
                    fill="currentColor"
                    d="M20.008 39.649H47.36c.913 0 1.71-.75 1.71-1.758s-.797-1.758-1.71-1.758H20.406c-1.336 0-2.156-.938-2.367-2.367l-.375-2.461h29.742c3.422 0 5.18-2.11 5.672-5.461l1.875-12.399a7 7 0 0 0 .094-.89c0-1.125-.844-1.899-2.133-1.899H14.641l-.446-2.976c-.234-1.805-.89-2.72-3.28-2.72H2.687c-.937 0-1.734.822-1.734 1.76c0 .96.797 1.781 1.735 1.781h7.921l3.75 25.734c.493 3.328 2.25 5.414 5.649 5.414m31.054-25.454L49.4 25.422c-.188 1.453-.961 2.344-2.344 2.344l-29.906.023l-1.993-13.594ZM21.86 51.04a3.766 3.766 0 0 0 3.797-3.797a3.78 3.78 0 0 0-3.797-3.797c-2.132 0-3.82 1.688-3.82 3.797c0 2.133 1.688 3.797 3.82 3.797m21.914 0c2.133 0 3.82-1.664 3.82-3.797c0-2.11-1.687-3.797-3.82-3.797c-2.109 0-3.82 1.688-3.82 3.797c0 2.133 1.711 3.797 3.82 3.797"
                  ></path>
                </svg>
              </button>
              <span className="absolute font-semibold right-0 text-sm top-1 bg-red-500 rounded-full w-4 h-4 text-white flex justify-center items-center">
                {cartCount}
              </span>
            </div>
            

            {/* Sidebar Drawer */}
            <div
              className={`fixed top-0 right-0 h-full w-full sm:w-[360px] bg-gray-300 shadow-lg transform transition-transform duration-300 z-[99999999999999999999]
  ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
            >
              {/* Header */}
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-lg font-semibold">Your Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500 hover:text-gray-800 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Cart Content */}
              <div className="flex flex-col h-[calc(100%-4rem)]">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500">Your cart is empty.</p>
                  ) : (
                    <ul className="space-y-3">
                      {cartItems.map((item) => (
                        <li
                          key={item.bookId}
                          className="flex items-center justify-between gap-3 border-b pb-2"
                        >
                          {/* Book Cover */}
                          <img
                            src={item.cover?.url}
                            alt={item.title?.bn || "Book Cover"}
                            className="w-12 h-16 object-cover rounded"
                          />

                          {/* Book Details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{item.title?.bn}</p>
                            <p className="text-gray-600 text-sm">৳{item.discountedPrice}</p>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm">x {item.quantity}</span>
                          </div>

                          {/* ❌ Remove Button */}
                          <button
                            onClick={() => handleRemoveFromCart(item.bookId)}
                            className="text-red-500 hover:text-red-700 text-sm"
                            title="Remove from cart"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>

                  )}
                </div>

                {/* Sticky Checkout Button */}
                <div className="p-4 border-t">
                  <Link
                    href={`/${locale}/cart`}
                    onClick={() => setIsCartOpen(false)}
                    className="bg-[#51acec] block text-center w-full p-3 rounded-lg text-white font-medium cursor-pointer"
                  >
                    {t5("purchaseNow")}
                  </Link>
                </div>
              </div>
            </div>

            
            {/* login/signup */}
            {session?.data?.user ? (
              <Link href={`/${locale}/user`}>
                <div className="avatar cursor-pointer">
                  <div className="w-10 rounded-full">
                    <Image
                      src={
                        session?.data?.user?.image
                          ? session.data.user.image
                          : "/assets/images/profile/profile.png"
                      }
                      width={600}
                      height={400}
                      alt="avatar"
                    />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="hidden lg:flex items-center gap-2 w-full justify-center">
                <button
                  onClick={() => {
                    router.push("/login");
                  }}
                  className="text-[#51acec] font-semibold cursor-pointer"
                >
                  {t("login")}
                </button>

                <button
                  onClick={() => {
                    router.push("/signup");
                  }}
                  className="bg-[#51acec] text-white px-3 py-1 rounded-lg duration-150 cursor-pointer"
                >
                  {t("register")}
                </button>
              </div>
            )}
          </div>
        </div>
        {/* sm device */}
        <div className="lg:hidden py-2">
          <div className="lg:hidden flex justify-between w-full">
            {/* navlogo */}
            {/* menu */}
            <button id="menuButton" aria-label="menu" className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"
                ></path>
              </svg>
            </button>
            <Link
              href="/"
              className="lg:hidden flex gap-1 items-center cursor-pointer"
            >
              <Image
                width={60}
                height={60}
                src={"/assets/images/logo/logo.png"}
                alt="ittadi books"
                className="bg-transparent drop-shadow-lg"
              />
              <div>
                <h3 className="font-semibold text-[#51acec] lg:text-xl title-main">
                  {t("title")}
                </h3>
              </div>
            </Link>
            {/* wishlist & cart sm */}
            <div className="flex items-center gap-2">
              <div
                onClick={() => {
                  router.push("/user/wishlist");
                }}
                className="flex items-center relative p-1 cursor-pointer"
              >
                <button
                  onClick={() => router.push("/user/wishlist")}
                  aria-label="wishlist"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M19.285 12.645a3.8 3.8 0 0 0-5.416-5.332q-.288.288-.732.707l-.823.775l-.823-.775q-.445-.42-.733-.707a3.8 3.8 0 0 0-5.374 0c-1.468 1.469-1.485 3.844-.054 5.32l6.984 6.984l6.97-6.972zm-14.75-6.18a5 5 0 0 1 7.072 0q.273.274.707.682q.432-.408.707-.683a5 5 0 0 1 7.125 7.017l-7.125 7.126a1 1 0 0 1-1.414 0L4.48 13.48a5 5 0 0 1 .055-7.017z"
                    ></path>
                  </svg>
                </button>
                <span className="absolute font-semibold right-0 text-sm top-1 bg-red-500 rounded-full w-4 h-4 text-white flex justify-center items-center">
                  {wishlistCount}
                </span>
              </div>

              <div id="menuButtonCart" className="flex items-center relative p-1 cursor-pointer">
                <button aria-label="cart">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 56 56"
                    className="hover:text-[#51acec] duration-150"
                  >
                    <path
                      fill="currentColor"
                      d="M20.008 39.649H47.36c.913 0 1.71-.75 1.71-1.758s-.797-1.758-1.71-1.758H20.406c-1.336 0-2.156-.938-2.367-2.367l-.375-2.461h29.742c3.422 0 5.18-2.11 5.672-5.461l1.875-12.399a7 7 0 0 0 .094-.89c0-1.125-.844-1.899-2.133-1.899H14.641l-.446-2.976c-.234-1.805-.89-2.72-3.28-2.72H2.687c-.937 0-1.734.822-1.734 1.76c0 .96.797 1.781 1.735 1.781h7.921l3.75 25.734c.493 3.328 2.25 5.414 5.649 5.414m31.054-25.454L49.4 25.422c-.188 1.453-.961 2.344-2.344 2.344l-29.906.023l-1.993-13.594ZM21.86 51.04a3.766 3.766 0 0 0 3.797-3.797a3.78 3.78 0 0 0-3.797-3.797c-2.132 0-3.82 1.688-3.82 3.797c0 2.133 1.688 3.797 3.82 3.797m21.914 0c2.133 0 3.82-1.664 3.82-3.797c0-2.11-1.687-3.797-3.82-3.797c-2.109 0-3.82 1.688-3.82 3.797c0 2.133 1.711 3.797 3.82 3.797"
                    ></path>
                  </svg>
                </button>
                <span className="select-none absolute font-semibold right-0 text-sm top-1 bg-red-500 rounded-full w-4 h-4 text-white flex justify-center items-center">
                  {cartCount}
                </span>
              </div>
            </div>
          </div>
          {/* down side */}
          {/* search */}
          <div className="flex mt-2 h-[40px] relative">
            <input
              type="text"
              name="book"
              id=""
              onChange={handleChange}
              placeholder={`${t("searchPlaceholder")}`}
              className="border-[1.5px] border-r-0 border-[#51acec] px-4 py-1 focus:outline-0 w-full rounded-l-lg h-full "
            />
            {results.length > 0 && (
               
              <ul className="absolute z-10 left-0 right-0 top-12 max-h-60 overflow-auto rounded-b-lg bg-white border border-gray-300 shadow-lg">
                {results.map((book) => (
                  <li
                    key={book.bookId}
                    onClick={() => handleSelect(book)}
                    className="flex flex-col justify-center px-4 py-3 cursor-pointer transition duration-200 hover:bg-[#51acec] hover:text-white group relative"
                  >
                    <span className="font-semibold text-gray-800 group-hover:text-white">
                      {book.title?.[locale] || "Untitled"}
                    </span>
                    <span className="text-sm text-gray-500 group-hover:text-gray-200">
                      {book.authors?.map((a) => a.name).join(", ") || "Unknown"}
                    </span>
                    {/* Optional: small arrow on hover */}
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white">
                      ➔
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <button
              aria-label="search"
              className="flex justify-center items-center bg-[#51acec]  w-14 rounded-r-lg "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M10.77 18.3a7.53 7.53 0 1 1 7.53-7.53a7.53 7.53 0 0 1-7.53 7.53m0-13.55a6 6 0 1 0 6 6a6 6 0 0 0-6-6"
                ></path>
                <path
                  fill="white"
                  d="M20 20.75a.74.74 0 0 1-.53-.22l-4.13-4.13a.75.75 0 0 1 1.06-1.06l4.13 4.13a.75.75 0 0 1 0 1.06a.74.74 0 0 1-.53.22"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* lg devcie downside */}

        {/* down section */}
        <div
          id="navLinks"
          className="title-main hidden lg:flex lg:justify-between justify-center items-center font-medium lg:text-[14px] xl:text-base 2xl:text-base"
        >
    
<Link href={`/`} className="w-full">
            <button
              className={`${lastPath === "new-books" && "bg-white text-black"
                } border-[1px]  hover:bg-white hover:text-black duration-150 bg-[#51acec] border-[#E4E4E4] w-full py-3 cursor-pointer`}
            >
              {t2("home")}
            </button>
          </Link>
           <Link href={`/${locale}/new-books`} className="w-full">
            <button
              className={`${lastPath === "new-books" && "bg-white text-black"
                } border-[1px]  hover:bg-white hover:text-black duration-150 bg-[#51acec] border-[#E4E4E4] w-full py-3 cursor-pointer`}
            >
              {t2("newbooks")}
            </button>
          </Link>
          <Link href={`/${locale}/ittadi-books`} className="w-full">
            <button
              className={`${lastPath === "ittadi-books" && "bg-white text-black"
                } border-[1px]  hover:bg-white hover:text-black duration-150 bg-[#51acec] border-[#E4E4E4] w-full py-3 cursor-pointer`}
            >
              {t2("ittadiBooks")}
            </button>
          </Link>
          <Link href={`/${locale}/bhumika-book`} className="w-full">
            <button
              className={`${lastPath === "bhumika-book" && "bg-white text-black"
                } border-[1px]  hover:bg-white hover:text-black duration-150 bg-[#51acec] border-[#E4E4E4] w-full py-3 cursor-pointer`}
            >
              {t2("bhumikabooks")}
            </button>
          </Link>
          <Link href={`/${locale}/allbooks`} className="w-full">
            <button
              className={`${lastPath === "allbooks" && "bg-white text-black"
                } border-[1px]  hover:bg-white hover:text-black duration-150 bg-[#51acec] border-[#E4E4E4] w-full py-3 cursor-pointer`}
            >
              {t2("allbooks")}
            </button>
          </Link>
          <Link href={`/${locale}/book-fair-2025`} className="w-full">
            <button
              className={`${lastPath === "book-fair-2025" && "bg-white text-black"
                } border-[1px]  hover:bg-white hover:text-black duration-150 bg-[#51acec] border-[#E4E4E4] w-full py-3 cursor-pointer`}
            >
              {t2("bookFair")}
            </button>
          </Link>
          <Link href={`/${locale}/authors`} className="w-full">
            <button
              className={`${lastPath === "authors" && "bg-white text-black"
                } border-[1px]  hover:bg-white hover:text-black duration-150 bg-[#51acec] border-[#E4E4E4] w-full py-3 cursor-pointer`}
            >
              {t2("author")}
            </button>
          </Link>

          
                    <Link href={`/${locale}/categories`} className="w-full">
            <button
              className={`${lastPath === "categories" && "bg-white text-black"
                } border-[1px]  hover:bg-white hover:text-black duration-150 bg-[#51acec] border-[#E4E4E4] w-full py-3 cursor-pointer`}
            >
              {t2("category")}
            </button>
          </Link>
          <Link href={`/${locale}/blogs`} className="w-full">
            <button
              className={`${lastPath === "blogs" && "bg-white text-black"
                } border-[1px]  hover:bg-white hover:text-black duration-150 bg-[#51acec] border-[#E4E4E4] w-full py-3 cursor-pointer`}
            >
              {t2("blog")}
            </button>
          </Link>
          <Link href={`/${locale}/gallery`} className="w-full">
            <button
              className={`${lastPath === "gallery" && "bg-white text-black"
                } border-[1px]  hover:bg-white hover:text-black duration-150 bg-[#51acec] border-[#E4E4E4] w-full py-3 cursor-pointer`}
            >
              {t2("gallery")}
            </button>
          </Link>
          
        </div>
      </div>
      {/* author */}
       
      {/* category */}
      <div id="categoryDiv" className="px-20 fixed w-full z-[999999999999]">
        <div
          id="categorySection"
          className="bg-[#F5F5F5] shadow-lg rounded-b-lg text-[#1f1f1f] lg:px-5  py-2 hidden "
        >
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-1">
            {categories.slice(0, 20).map((cat, i) => (
              <li
                onClick={() => {
                  router.push(`/categories/${encodeURIComponent(cat.en)}`);
                }}
                className="hover:bg-[#e0e0e0] hover:font-semibold rounded-lg duration-150 py-2 px-4 cursor-pointer"
                key={i}
              >
                {lang === "en" ? cat?.en : cat?.bn}
              </li>
            ))}
          </ul>
          <div
            onClick={() => window.location.replace("/categories")}
            className="flex justify-end"
          >
            <button
              onClick={() => router.push("/categories")}
              className="hover:font-medium rounded-lg duration-150 py-1 px-4 cursor-pointer flex gap-2 items-center"
            >
              <span>{seemore("title")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                viewBox="0 0 24 24"
              >
                <g fill="none" fillRule="evenodd">
                  <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                  <path
                    fill="currentColor"
                    d="M15.707 11.293a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414l4.95-4.95l-4.95-4.95a1 1 0 0 1 1.414-1.414z"
                  ></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/*sm device menu  */}
      <div
        id="sidemenu"
        className="lg:hidden overflow-y-auto fixed top-0 -left-[100%] h-full w-full bg-[#F9FAFB] p-5 z-[99999999999999999999999]"
      >
        <div className="flex flex-col h-full justify-between">
          {/* top section */}
          <div className="flex justify-between">
            {/* navlogo */}
            <div
              onClick={() => {
                router.replace("/");
              }}
              className="flex gap-1 items-center cursor-default"
            >
              <Image
                width={50}
                height={50}
                src={"/assets/images/logo/logo.png"}
                alt="ittadi books"
                className="bg-transparent drop-shadow-lg"
              />
              <div>
                <h3 className="font-semibold text-[#51acec] lg:text-xl title-main">
                  {t("title")}
                </h3>
              </div>
            </div>
            {/* cross */}
            <button id="crossButton" className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={40}
                height={40}
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth={1.5}
                  d="m8.464 15.535l7.072-7.07m-7.072 0l7.072 7.07"
                ></path>
              </svg>
            </button>
          </div>
          {/* middle section */}
          <div
            id="navLinks"
            className="title-main flex justify-between flex-col items-center font-medium py-10"
          >
             <Link
              href={`/${locale}`}
              onClick={() => {
                const sideMenu = document.getElementById("sidemenu");
                if(sideMenu) sideMenu.style.left = "-100%";
              }}
              className="border-b-[1px] hover:bg-[#51acec] text-start hover:text-white duration-150 border-[#E4E4E4] w-full py-3 cursor-pointer"
            >
              {t2("home")}
            </Link>
            <Link
              href={`/${locale}/user`}
              onClick={() => {
                const sideMenu = document.getElementById("sidemenu");
                if(sideMenu) sideMenu.style.left = "-100%";
              }}
              className="border-b-[1px] hover:bg-[#51acec] text-start hover:text-white duration-150 border-[#E4E4E4] w-full py-3 cursor-pointer"
            >
              {t2("profile")}
            </Link>

            <Link
              href={`/${locale}/new-books`}
              onClick={() => {
                const sideMenu = document.getElementById("sidemenu");
                if(sideMenu) sideMenu.style.left = "-100%";
              }}
              className="border-b-[1px] hover:bg-[#51acec] text-start hover:text-white duration-150 border-[#E4E4E4] w-full py-3 cursor-pointer"
            >
              {t2("newbooks")}
            </Link>
            <Link
              href={`/${locale}/ittadi-books`}
              onClick={() => {
                const sideMenu = document.getElementById("sidemenu");
                if(sideMenu) sideMenu.style.left = "-100%";
              }}
              className="border-b-[1px] hover:bg-[#51acec] text-start hover:text-white duration-150 border-[#E4E4E4] w-full py-3 cursor-pointer"
            >
              {t2("ittadiBooks")}
            </Link>
            <Link
              href={`/${locale}/bhumika-book`}
              onClick={() => {
                const sideMenu = document.getElementById("sidemenu");
                if(sideMenu) sideMenu.style.left = "-100%";
              }}
              className="border-b-[1px] hover:bg-[#51acec] text-start hover:text-white duration-150 border-[#E4E4E4] w-full py-3 cursor-pointer"
            >
              {t2("bhumikabooks")}
            </Link>
            <Link
              href={`/${locale}/allbooks`}
              onClick={() => {
                const sideMenu = document.getElementById("sidemenu");
                if(sideMenu) sideMenu.style.left = "-100%";
              }}
              className="border-b-[1px] hover:bg-[#51acec] text-start hover:text-white duration-150 border-[#E4E4E4] w-full py-3 cursor-pointer"
            >
              {t2("allbooks")}
            </Link>
            <Link
              href={`/${locale}/book-fair-2025`}
              onClick={() => {
                const sideMenu = document.getElementById("sidemenu");
                if(sideMenu) sideMenu.style.left = "-100%";
              }}
              className="border-b-[1px] hover:bg-[#51acec] text-start hover:text-white duration-150 border-[#E4E4E4] w-full py-3 cursor-pointer"
            >
              {t2("bookFair")}
            </Link>

            <Link
              href={`/${locale}/authors`}
              onClick={() => {
                const sideMenu = document.getElementById("sidemenu");
                if(sideMenu) sideMenu.style.left = "-100%";
              }}
              className="border-b-[1px] hover:bg-[#51acec] text-start hover:text-white duration-150 border-[#E4E4E4] w-full py-3 cursor-pointer"
            >
              {t2("author")}
            </Link>
            <Link
              href={`/${locale}/categories`}
              onClick={() => {
                const sideMenu = document.getElementById("sidemenu");
                if(sideMenu) sideMenu.style.left = "-100%";
              }}
              className="border-b-[1px] hover:bg-[#51acec] text-start hover:text-white duration-150 border-[#E4E4E4] w-full py-3 cursor-pointer"
            >
              {t2("category")}
            </Link>
            <Link
              href={`/${locale}/blogs`}
              onClick={() => {
                const sideMenu = document.getElementById("sidemenu");
                if(sideMenu) sideMenu.style.left = "-100%";
              }}
              className="border-b-[1px] hover:bg-[#51acec] text-start hover:text-white duration-150 border-[#E4E4E4] w-full py-3 cursor-pointer"
            >
              {t2("blog")}
            </Link>
            <Link
              href={`/${locale}/gallery`}
              onClick={() => {
                const sideMenu = document.getElementById("sidemenu");
                if(sideMenu) sideMenu.style.left = "-100%";
              }}
              className="border-b-[1px] hover:bg-[#51acec] text-start hover:text-white duration-150 border-[#E4E4E4] w-full py-3 cursor-pointer"
            >
              {t2("gallery")}
            </Link>

            {/* cart button */}
             <Link
              href={`/${locale}/cart`}
              onClick={() => {
                const sideMenu = document.getElementById("sidemenu");
                if(sideMenu) sideMenu.style.left = "-100%";
              }}
              className="border-b-[1px] hover:bg-[#51acec] text-start hover:text-white duration-150 border-[#E4E4E4] flex gap-2 items-center justify-between w-full py-3 cursor-pointer"
            >
              {t2("cart")}
              <div className="relative flex items-center p-1">
                <button aria-label="cart" className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 56 56"
                    className="hover:text-[#51acec] duration-150"
                  >
                    <path
                      fill="currentColor"
                      d="M20.008 39.649H47.36c.913 0 1.71-.75 1.71-1.758s-.797-1.758-1.71-1.758H20.406c-1.336 0-2.156-.938-2.367-2.367l-.375-2.461h29.742c3.422 0 5.18-2.11 5.672-5.461l1.875-12.399a7 7 0 0 0 .094-.89c0-1.125-.844-1.899-2.133-1.899H14.641l-.446-2.976c-.234-1.805-.89-2.72-3.28-2.72H2.687c-.937 0-1.734.822-1.734 1.76c0 .96.797 1.781 1.735 1.781h7.921l3.75 25.734c.493 3.328 2.25 5.414 5.649 5.414m31.054-25.454L49.4 25.422c-.188 1.453-.961 2.344-2.344 2.344l-29.906.023l-1.993-13.594ZM21.86 51.04a3.766 3.766 0 0 0 3.797-3.797a3.78 3.78 0 0 0-3.797-3.797c-2.132 0-3.82 1.688-3.82 3.797c0 2.133 1.688 3.797 3.82 3.797m21.914 0c2.133 0 3.82-1.664 3.82-3.797c0-2.11-1.687-3.797-3.82-3.797c-2.109 0-3.82 1.688-3.82 3.797c0 2.133 1.711 3.797 3.82 3.797"
                    ></path>
                  </svg>
                </button>
                <span className="absolute font-semibold right-0 text-sm top-1 bg-red-500 rounded-full w-4 h-4 text-white flex justify-center items-center">
                  {cartCount}
                </span>
              </div>
            </Link>
            {/* wishlist button */}
             <Link
              href={`/${locale}/user/wishlist`}
              onClick={() => {
                const sideMenu = document.getElementById("sidemenu");
                if(sideMenu) sideMenu.style.left = "-100%";
              }}
              className="border-b-[1px] hover:bg-[#51acec] text-start hover:text-white duration-150 border-[#E4E4E4] flex gap-2 items-center justify-between w-full py-3 cursor-pointer"
            >
              {t2("wishlist")}
              <div className="relative flex items-center p-1">
                <button aria-label="wishlist" className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={28}
                    height={28}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M19.285 12.645a3.8 3.8 0 0 0-5.416-5.332q-.288.288-.732.707l-.823.775l-.823-.775q-.445-.42-.733-.707a3.8 3.8 0 0 0-5.374 0c-1.468 1.469-1.485 3.844-.054 5.32l6.984 6.984l6.97-6.972zm-14.75-6.18a5 5 0 0 1 7.072 0q.273.274.707.682q.432-.408.707-.683a5 5 0 0 1 7.125 7.017l-7.125 7.126a1 1 0 0 1-1.414 0L4.48 13.48a5 5 0 0 1 .055-7.017z"
                    ></path>
                  </svg>
                </button>
                <span className="absolute font-semibold right-0 text-sm top-1 bg-red-500 rounded-full w-4 h-4 text-white flex justify-center items-center">
                  {wishlistCount}
                </span>
              </div>
            </Link>
          </div>
          {/* last section */}
          {/* login */}
          <div className="flex flex-col justify-center items-center gap-4 lg:gap-5">
            {/* language switch */}
            {/* social icon */}{" "}
            {session?.data && session?.data?.user?.role === "admin" && (
              <a href="/admin" className="text-[#51acec] font-semibold">
                Admin Page
              </a>
            )}
            <div className="flex justify-center items-center gap-3 mt-2">
              {" "}
              <button
                onClick={() => {
                  window.open(
                    "https://www.facebook.com/share/1QZoFktfgp/?mibextid=wwXIfr",
                    "_blank"
                  );
                }}
              >
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={28}
                  height={28}
                  viewBox="0 0 24 24"
                >
                  {" "}
                  <path
                    fill="#51acec"
                    d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
                  ></path>{" "}
                </svg>{" "}
              </button>{" "}
              <button
                onClick={() => {
                  window.open("https://wa.me/8801735393639", "_blank");
                }}
              >
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={28}
                  height={28}
                  viewBox="0 0 24 24"
                >
                  {" "}
                  <g fill="none" fillRule="evenodd">
                    {" "}
                    <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>{" "}
                    <path
                      fill="#51acec"
                      d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2A1.01 1.01 0 0 0 3.8 21.454l3.032-.892A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2M9.738 14.263c2.023 2.022 3.954 2.289 4.636 2.314c1.037.038 2.047-.754 2.44-1.673a.7.7 0 0 0-.088-.703c-.548-.7-1.289-1.203-2.013-1.703a.71.71 0 0 0-.973.158l-.6.915a.23.23 0 0 1-.305.076c-.407-.233-1-.629-1.426-1.055s-.798-.992-1.007-1.373a.23.23 0 0 1 .067-.291l.924-.686a.71.71 0 0 0 .12-.94c-.448-.656-.97-1.49-1.727-2.043a.7.7 0 0 0-.684-.075c-.92.394-1.716 1.404-1.678 2.443c.025.682.292 2.613 2.314 4.636"
                    ></path>{" "}
                  </g>{" "}
                </svg>{" "}
              </button>{" "}
            </div>
            <LocaleSwitcher />
            {/* login */}
             {session.data?.user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 w-full text-center justify-center font-medium text-red-600 hover:underline pt-2 mb-3 cursor-pointer"
              >
                {/* Logout Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M5 3h6a3 3 0 0 1 3 3v4h-1V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4h1v4a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3m3 9h11.25L16 8.75l.66-.75l4.5 4.5l-4.5 4.5l-.66-.75L19.25 13H8z"
                  ></path>
                </svg>
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-3 w-full justify-center mb-3">
                <Link
                  href={`/${locale}/login`}
                  className="text-[#51acec] font-semibold cursor-pointer"
                >
                  {t("login")}
                </Link>

                <Link
                  href={`/${locale}/signup`}
                  className="bg-[#51acec] text-white px-3 py-1 rounded-lg duration-150 cursor-pointer"
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* sm device carttt */}
      <div
        id="sidemenuCart"
        className="lg:hidden overflow-y-auto fixed top-0 -right-[100%] h-full w-full bg-[#F9FAFB] p-5 z-[99999999999999999999999]"
      >
        <div className="flex flex-col h-full justify-between">
          {/* top section */}
          <div className="flex justify-between">
            {/* navlogo */}
            <div className="flex gap-1 items-center cursor-default">
              <h2 className="text-2xl font-semibold">Your Cart</h2>
            </div>
            {/* cross */}
            <button id="crossButtonCart" className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={40}
                height={40}
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth={1.5}
                  d="m8.464 15.535l7.072-7.07m-7.072 0l7.072 7.07"
                ></path>
              </svg>
            </button>
          </div>

          {/* Example cart items */}
          <div className="flex flex-col h-[calc(100%-4rem)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                <ul className="space-y-3">
                  {cartItems.map((item) => (
                    <li
                      key={item.bookId}
                      className="flex items-center justify-between gap-3 border-b pb-2"
                    >
                      {/* Book Cover */}
                      <img
                        src={item.cover?.url}
                        alt={item.title?.bn || "Book Cover"}
                        className="w-12 h-16 object-cover rounded"
                      />

                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {item.title?.bn}
                        </p>
                        <p className="text-gray-600 text-sm">
                          ৳{item.discountedPrice}
                        </p>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm">x {item.quantity}</span>
                      </div>
                      {/* ❌ Remove Button */}
                      <button
                        onClick={() => handleRemoveFromCart(item.bookId)}
                        className="text-red-500 hover:text-red-700 text-sm"
                        title="Remove from cart"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Sticky Checkout Button */}
            <div className="p-4">
              <Link
                href={`/${locale}/cart`}
                onClick={() => {
                  const sideMenuCart = document.getElementById("sidemenuCart");
                  if(sideMenuCart) sideMenuCart.style.right = "-100%";
                }}
                className="bg-[#51acec] block text-center w-full p-3 rounded-lg text-white font-medium cursor-pointer"
              >
                {t5("purchaseNow")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
