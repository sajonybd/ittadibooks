


"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CategoryPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true); // toggle sort

  const getcategories = async () => {
    const data = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories/getAll`
    );
    setCategories(data?.data?.categories || []);
  };

  useEffect(() => {
    getcategories();
  }, []);

  const handleView = (id) => router.push(`/admin/categories/${id}`);
  const handleEdit = (id) => router.push(`/admin/categories/editCategory/${id}`);
  const handleAdd = () => router.push(`/admin/categories/addCategory`);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories/delete/${id}`);
      // refresh categories
      getcategories();
    } catch (err) {
      // // console.error("Failed to delete category:", err);
      alert("Failed to delete category");
    }
  };

  // Filter categories by search
  const filteredCategories = categories.filter((cat) => {
    const en = cat.en?.toLowerCase() || "";
    const bn = cat.bn?.toLowerCase() || "";
    return en.includes(search.toLowerCase()) || bn.includes(search.toLowerCase());
  });

  // Sort categories alphabetically (Bangla first)
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    const nameA = a.bn && a.bn.trim() !== "" ? a.bn : a.en || "";
    const nameB = b.bn && b.bn.trim() !== "" ? b.bn : b.en || "";
    return sortAsc ? nameA.localeCompare(nameB, "bn") : nameB.localeCompare(nameA, "bn");
  });

  const toggleSort = () => setSortAsc((prev) => !prev);

  return (
    <div className="lg:p-6 lg:max-w-6xl mx-auto">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage Categories</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <input
        type="text"
        placeholder="Search categories..."
        className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full text-base">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">#</th>
              <th
                className="px-4 py-2 cursor-pointer select-none"
                onClick={toggleSort}
              >
                Category {sortAsc ? "↑" : "↓"}
              </th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCategories.map((cat, idx) => (
              <tr key={cat._id} className="border-t">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">
                  {cat.bn} / {cat.en}
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    onClick={() => handleView(cat._id)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(cat._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {sortedCategories.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
