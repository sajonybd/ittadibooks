 
"use client";
import { useTranslations } from "next-intl";
import FilteredBookGrid from "@/app/components/FilteredBookGrid";

export default function AllBooksPage({ authors, categories }) {
  const t = useTranslations("allBooks");

  return (
    <FilteredBookGrid
      title={t("title")}
      authors={authors}
      categories={categories}
    />
  );
}
