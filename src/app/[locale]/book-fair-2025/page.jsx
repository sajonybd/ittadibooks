"use client";
import BookCard from "@/app/components/BookCard";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FilteredBookGrid from "@/app/components/FilteredBookGrid";

const fakeBooks = Array.from({ length: 42 }).map((_, i) => ({
  id: i + 1,
  title: `Ittadi Book ${i + 1}`,
  author: `Author ${i + 1}`,
  description: "This is a sample book from Ittadi Publication.",
}));

export default function IttadiBooksPage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL
          }/api/getbookbycollection?collection=${"bookfair2025"}`
        );
        const data = await res.json();
        setBooks(data.books);
      } catch (error) {
        // // // console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const t = useTranslations("bookFair2025");

  return <FilteredBookGrid allBooks={books} title={t("title")} />;
}
