
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useParams } from "next/navigation";

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const { locale } = useParams();

  const getAuthors = async () => {
    const data = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/authors/getAll`
    );
    setAuthors(data?.data?.authors || []);
  };

  useEffect(() => {
    getAuthors();
  }, []);

  // Delete author
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this author?")) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/authors/delete/${id}`
      );
      if (res.data.success) {
        setAuthors((prev) => prev.filter((a) => a._id !== id));
      } else {
        alert("Failed to delete author");
      }
    } catch (error) {
      // // console.error(error);
      alert("Something went wrong");
    }
  };

  // filtering
  const filteredAuthors = authors.filter((author) => {
    const nameBn = author?.nameBn || "";
    const name = author?.name || "";
    return (
      nameBn.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase())
    );
  });

  // sorting (Bangla first, fallback English)
  const sortedAuthors = [...filteredAuthors].sort((a, b) => {
    const nameA =
      a?.nameBn && a.nameBn.trim() !== "" ? a.nameBn : a?.name || "";
    const nameB =
      b?.nameBn && b.nameBn.trim() !== "" ? b.nameBn : b?.name || "";

    if (sortAsc) {
      return nameA.localeCompare(nameB, "bn");
    } else {
      return nameB.localeCompare(nameA, "bn");
    }
  });

  const handleSort = () => setSortAsc((prev) => !prev);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Authors</h2>
        <p className="font-semibold text-lg">
          Total Authors : {authors.length}
        </p>
      </div>

      <input
        type="text"
        placeholder="Search authors..."
        className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-4 text-left">Image</th>
              <th
                className="py-2 px-4 text-left cursor-pointer select-none"
                onClick={handleSort}
              >
                Name {sortAsc ? "↑" : "↓"}
              </th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Mobile</th>
              <th className="py-2 px-4 text-left">DOB</th>
              <th className="py-2 px-4 text-left">DOD</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAuthors.map((author, idx) => (
              <tr key={author._id || idx} className="border-t">
                <td className="py-2 px-4 w-[260px]">
                  <img
                    src={
                      author.imageUrl ||
                      "/assets/images/profile/profileForAuthor.png"
                    }
                    alt={author.nameBn || author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="py-2 px-4">
                  {author?.nameBn} / {author?.name}
                </td>
                 
                <td className="py-2 px-4">{author.email || "-"}</td>
                <td className="py-2 px-4">{author.mobile || "-"}</td>
                <td className="py-2 px-4">{author.dob || "-"}</td>
                <td className="py-2 px-4">{author.dod || "-"}</td>
                <td className="py-2 px-4 space-x-2">
                  <Link href={`/admin/authors/${author._id}`}>
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      View
                    </span>
                  </Link>
                  <Link href={`/admin/authors/editAuthors/${author._id}`}>
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      Edit
                    </span>
                  </Link>
                  <button
                    onClick={() => handleDelete(author._id)}
                    className="text-red-600 hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {authors.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No authors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
