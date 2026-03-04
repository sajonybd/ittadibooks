"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import FilteredBookGrid from "@/app/components/FilteredBookGrid";

export default function IttadiBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL
          }/api/getbookbycollection?collection=${"bookfair2025"}`
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
  }, []);

  const t = useTranslations("bookFair2025");

  return <FilteredBookGrid allBooks={books} title={t("title")} isLoading={loading} />;
}
