


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCategoryPage() {
  const router = useRouter();
  const [en, setEn] = useState("");
  const [bn, setBn] = useState("");
  const [subcategories, setSubcategories] = useState([{ en: "", bn: "" }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubChange = (index, field, value) => {
    const newSubs = [...subcategories];
    newSubs[index][field] = value;
    setSubcategories(newSubs);
  };

  const addSubcategoryField = () => {
    setSubcategories([...subcategories, { en: "", bn: "" }]);
  };

  const removeSubcategoryField = (index) => {
    const newSubs = subcategories.filter((_, i) => i !== index);
    setSubcategories(newSubs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories/addCategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ en, bn, subcategories }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Category added successfully!");
        setEn("");
        setBn("");
        setSubcategories([{ en: "", bn: "" }]);
        router.refresh();
      } else {
        setMessage(data.message || "Error occurred");
      }
    } catch (error) {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-10">
      <h1 className="text-xl font-bold mb-4">Add New Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Category */}
        <div>
          <label className="block mb-1 font-medium">English Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={en}
            onChange={(e) => setEn(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Bangla Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={bn}
            onChange={(e) => setBn(e.target.value)}
            required
          />
        </div>

        {/* Subcategories */}
        <div>
          <label className="block mb-2 font-medium">Subcategories</label>
          {subcategories.map((sub, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Subcategory (English)"
                className="input input-bordered w-full"
                value={sub.en}
                onChange={(e) =>
                  handleSubChange(idx, "en", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Subcategory (বাংলা)"
                className="input input-bordered w-full"
                value={sub.bn}
                onChange={(e) =>
                  handleSubChange(idx, "bn", e.target.value)
                }
              />
              {subcategories.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSubcategoryField(idx)}
                  className="btn btn-error text-white"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSubcategoryField}
            className="btn bg-green-600 text-white mt-2"
          >
            + Add Subcategory
          </button>
        </div>

        <button
          type="submit"
          className="btn bg-blue-600 text-white w-full"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
        {message && (
          <p className="mt-2 text-sm text-center text-green-600">{message}</p>
        )}
      </form>
    </div>
  );
}
