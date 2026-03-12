import FilteredBookGrid from "@/app/components/FilteredBookGrid";
import { getCategories, getNavbarAuthors } from "@/lib/siteDataCache";
import { getTranslations } from "next-intl/server";

export default async function IttadiBooksPage() {
  const [authors, categories, t] = await Promise.all([
    getNavbarAuthors(),
    getCategories(),
    getTranslations("ittadiBooks"),
  ]);

  return (
    <FilteredBookGrid
      title={t("title")}
      authors={authors}
      categories={categories}
      collection="ittadiBooks"
    />
  );
}
