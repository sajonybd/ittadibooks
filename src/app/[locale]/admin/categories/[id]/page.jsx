

"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function CategoryDetailPage({ params: paramsPromise }) {
  const router = useRouter();
  const params = use(paramsPromise); // unwrap the promise
  const { id } = params;
  const [category, setCategory] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchCategoryDetail = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories/getDetail/${id}`);
        setCategory(res.data);
      } catch (error) {
        // // // console.error("Failed to fetch category", error);
      }
    };

    if (id) fetchCategoryDetail();
  }, [id]);

  useEffect(() => {
    if(!category) return;
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/getBookByCategory/${category?.bn}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setBooks(data);
        } else if (Array.isArray(data.books)) {
          setBooks(data.books);
        } else {
          setBooks([]);
        }
      } catch (error) {
        setBooks([]);
      }
    };

    fetchBooks();
  }, [category]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories/delete/${id}`);
      alert("Category deleted successfully");
      router.push("/admin/categories");
    } catch (error) {
      alert("Failed to delete category");
    }
  };

  if (!category) {
    return (
      <div className="p-6 text-center text-gray-600">Category not found.</div>
    );
  }

  return (
    <div className="lg:p-6 lg:max-w-6xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold mb-2">{category.bn} / {category.en}</h2>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:underline text-sm"
        >
          Delete Category
        </button>
      </div>

      {/* Subcategories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Subcategories:</h3>
          <ul className="list-disc pl-6 text-gray-800">
            {category.subcategories.map((sub, idx) => (
              <li key={idx}>{sub.bn} / {sub.en}</li>
            ))}
          </ul>
        </div>
      )}

      <h3 className="text-xl font-semibold mt-6 mb-2">
        Books in this category:
      </h3>
      <ul className="list-disc pl-6 text-gray-800">
        {books && books.length > 0 ? (
          books.map((book, idx) => <li key={idx}>{book.title.bn}</li>)
        ) : (
          <p className="text-gray-500">No books in this category.</p>
        )}
      </ul>
    </div>
  );
}

