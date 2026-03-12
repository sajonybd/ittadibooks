import { getCategories } from "@/lib/siteDataCache";
import Link from "next/link";

export default async function CategoriesPage({ params }) {
  const { locale } = await params;
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Explore Book Categories
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((cat, i) => {
          const categorySlug = encodeURIComponent((cat?.en || "").split("/")[0]);

          return (
            <Link
              key={i}
              href={`/categories/${categorySlug}`}
              className="bg-[#e4e4e4] shadow-md hover:shadow-xl rounded-lg p-6 text-center transition"
            >
              <h2 className="text-lg font-semibold">{cat?.[locale]}</h2>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
