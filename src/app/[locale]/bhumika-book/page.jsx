import FilteredBookGrid from "@/app/components/FilteredBookGrid";
import { getCategories, getNavbarAuthors } from "@/lib/siteDataCache";
import { getTranslations } from "next-intl/server";

export default async function BhumikaBooksPage() {
  const [authors, categories, t] = await Promise.all([
    getNavbarAuthors(),
    getCategories(),
    getTranslations("bhumikaBooks"),
  ]);

  return (
    <FilteredBookGrid
      title={t("title")}
      authors={authors}
      categories={categories}
      collection="bhumikaBooks"
    />
  );
}
