

"use client";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/getAll`
        );
        const data = await res.json();

        // Sort alphabetically by Bangla by default
        const sorted = [...data].sort((a, b) => {
          const nameA = a.bn || "";
          const nameB = b.bn || "";
          return nameA.localeCompare(nameB, "bn"); // Bangla sorting
        });

        setCategories(sorted);
      } catch (error) {
        // // console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Explore Book Categories
      </h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
       
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
  {categories.map((cat, i) => {
    // Safely get the first part before slash, fallback to empty string
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

      )}
    </div>
  );
}
