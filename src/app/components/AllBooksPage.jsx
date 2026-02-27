 

"use client";
import BookCard from "@/app/components/BookCard";
import { useTranslations } from "next-intl";
import { useState } from "react";
import FilteredBookGrid from "@/app/components/FilteredBookGrid";

export default function AllBooksPage({ books }) {
  const t = useTranslations("allBooks");

  return <FilteredBookGrid allBooks={books} title={t("title")} />;
}
