"use client";
import React, { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import MobileSidebar from "../MobileSidebar";

export default function BrowseSidebar({
  sort,
  setSort,
  filters,
  setFilters,
  // authors = SAMPLE_AUTHORS,
  publishers = SAMPLE_PUBLISHERS,
}) {
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [qAuthor, setQAuthor] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [qCategory, setQCategory] = useState("");
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories/getAll`
        );
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        // // console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/getAll`
        );
        const data = await res.json();
        setAuthors(data.authors || []);
      } catch (error) {
        // // console.error("Error fetching categories:", error);
      }
    };
    fetchAuthors();
  }, []);

  
  const filteredAuthors = useMemo(() => {
    // Step 1: Filter authors based on search input
    const filtered = qAuthor
      ? authors.filter((a) =>
          a.nameBn.toLowerCase().includes(qAuthor.toLowerCase())
        )
      : authors;

    // Step 2: Sort filtered authors alphabetically (Bangla)
    const sorted = [...filtered].sort((a, b) =>
      (a.nameBn || "").localeCompare(b.nameBn || "", "bn-BD")
    );

    return sorted;
  }, [authors, qAuthor]);

  const filteredCategories = useMemo(() => {
    const filtered = qCategory
      ? categories.filter((c) =>
          (c.bn || "").toLowerCase().includes(qCategory.toLowerCase())
        )
      : categories;

    // Sort alphabetically in Bangla
    return [...filtered].sort((a, b) =>
      (a.bn || "").localeCompare(b.bn || "", "bn-BD")
    );
  }, [categories, qCategory]);
  

  function toggleArray(key, value) {
    setFilters((prev) => {
      const next = { ...prev };
      if (!next[key]) next[key] = [];
      if (next[key].includes(value)) {
        next[key] = next[key].filter((x) => x !== value);
      } else {
        next[key] = [...next[key], value];
      }
      return next;
    });
  }

  function resetFilters() {
    setFilters({
      categories: [],
      authors: [],
      publishers: [],
      ebookOnly: false,
      inStockOnly: false,
    });
    setSort("ALL_BOOKS");
  }

  const SidebarBody = (
    <>
      {/* Categories */}
      {/* Categories */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Categories</p>
          <button
            className="text-xs text-slate-500"
            onClick={() => setFilters((f) => ({ ...f, categories: [] }))}
          >
            Clear
          </button>
        </div>
        <input
          value={qCategory}
          onChange={(e) => setQCategory(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-4 pr-3 py-2 text-sm rounded-md border border-gray-200 mb-2"
        />
        <div className="grid gap-1 overflow-y-scroll max-h-60">
          {filteredCategories.map((c, idx) => (
            <button
              key={idx}
              onClick={() => {
                toggleArray("categories", c.bn);
                 window.scrollTo({ top: 0, behavior: "smooth" });
                if (window.innerWidth < 768) {
                  // md breakpoint
                  setFilterOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm w-full text-left hover:bg-gray-50 `}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="truncate">{c.bn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Sort</p>
          <button onClick={resetFilters} className="text-xs text-sky-600">
            Reset
          </button>
        </div>
        <div className="space-y-2 text-sm">
          {sortOptions.map((s) => (
            <label key={s.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="sort"
                checked={sort === s.value}
                onChange={() => {
                  if (window.innerWidth < 768) { // md breakpoint
                    setFilterOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                   window.scrollTo({ top: 0, behavior: "smooth" });
                  setSort(s.value);
                }}
              />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Authors */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">By Authors</p>
          <button
            className="text-xs text-slate-500"
            onClick={() => setFilters((f) => ({ ...f, authors: [] }))}
          >
            Clear
          </button>
        </div>
        <input
          value={qAuthor}
          onChange={(e) => setQAuthor(e.target.value)}
          placeholder="Search authors..."
          className="w-full pl-4 pr-3 py-2 text-sm rounded-md border border-gray-200"
        />
        <div className="max-h-40 overflow-y-scroll mt-2 space-y-2">
          {filteredAuthors.map((a, idx) => (
            <label key={idx} className="flex items-center gap-2  text-sm">
              <input
                type="checkbox"
                checked={filters.authors.includes(a.nameBn)}
                onChange={() => {
                  if (window.innerWidth < 768) {
                    // md breakpoint
                    setFilterOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                  toggleArray("authors", a.nameBn);
                   window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
              <span className="truncate">{a.nameBn}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Publishers */}
      <div className="mb-4">
        
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:hidden lg:block w-full max-w-xs bg-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold">Filter & Sort</h2>
        </div>
        {SidebarBody}
      </aside>

      {/* Mobile */}
      
      {/* Mobile */}
      <div className="lg:hidden md:block mt-5 w-full mb-5">
        <button
          onClick={() => setFilterOpen(true)}
          className="bg-[#51acec] text-white px-4 py-2 rounded-lg w-full"
        >
          Filter / Sort
        </button>
        <MobileSidebar filterOpen={filterOpen} setFilterOpen={setFilterOpen}>
          {SidebarBody}
        </MobileSidebar>

        
      </div>
    </>
  );
}

const sortOptions = [
  { value: "ALL_BOOKS", label: "All Books" },
  { value: "bestSellers", label: "Best Seller" },
  { value: "ID_DESC", label: "New Released" },
  { value: "PRICE_ASC", label: "Price - Low to High" },
  { value: "PRICE_DESC", label: "Price - High to Low" },
];

const SAMPLE_AUTHORS = [
  { id: 930, label: "রবীন্দ্রনাথ ঠাকুর" },
  { id: 6684, label: "শরৎচন্দ্র চট্টোপাধ্যায়" },
  { id: 15216, label: "লেডিবার্ড" },
  { id: 7245, label: "বিভূতিভূষণ বন্দ্যোপাধ্যায়" },
  { id: 62778, label: "ওম বুকস এডিটোরিয়াল টিম" },
];

const SAMPLE_PUBLISHERS = [
  { id: 642, label: "দে’জ পাবলিশিং (ভারত)" },
  { id: 1192, label: "স্প্রিংগার" },
  { id: 123, label: "আনন্দ পাবলিশার্স" },
  { id: 2, label: "অনন্যা" },
  { id: 1055, label: "পিয়ারসন (ভারত)" },
];
