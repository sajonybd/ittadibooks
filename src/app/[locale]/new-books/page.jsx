"use client";
import BookCard from "@/app/components/BookCard";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FilteredBookGrid from "@/app/components/FilteredBookGrid";

 

export default function NewBooksPage() {
  const [books, setBooks] = useState([]);
// const { locale } = useRouter();

  const t = useTranslations("newBooks");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/getbookbycollection?collection=${"newArrivals"}`
        );
        const data = await res.json();
        setBooks(data.books);
      } catch (error) {
        // // // console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

 
  return <FilteredBookGrid allBooks={books} title={t("title")} />;
}

