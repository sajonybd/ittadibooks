import AllBooksPage from "@/app/components/AllBooksPage";
import { getCategories, getNavbarAuthors } from "@/lib/siteDataCache";

export const revalidate = false;

export default async function Page() {
  const [authors, categories] = await Promise.all([
    getNavbarAuthors(),
    getCategories(),
  ]);

  return <AllBooksPage authors={authors} categories={categories} />;
}
