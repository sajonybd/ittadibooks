

"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function AuthorDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise); // unwrap params
  const { id } = params;
const router = useRouter();
  const [author, setAuthor] = useState(null);
  const [authorBooks, setAuthorBooks] = useState([]);

  // Fetch author detail
  useEffect(() => {
    const fetchAuthorDetail = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/authors/getDetail/${id}`
        );
        setAuthor(res.data);
      } catch (error) {
        // // console.error("Failed to fetch author", error);
      }
    };

    if (id) {
      fetchAuthorDetail();
    }
  }, [id]);

  // Fetch author books
  useEffect(() => {
    const fetchAuthorBooks = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/getBookWIthBn/${author.uid}`
        );
        const data = await res.json();
        if (res.ok) setAuthorBooks(data);
      } catch (error) {
        // // console.error("Error fetching author books:", error);
      }
    };

    if (author?.uid) {
      fetchAuthorBooks();
    }
  }, [author?.uid]);

  if (!author) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>
      {/* Header */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={author.imageUrl || "/assets/images/profile/profileForAuthor.png"}
          className="w-24 h-24 rounded-full object-cover object-center border-2 border-gray-600"
          alt={author.name || author.nameBn}
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {author.nameBn} | {author.name}
          </h2>
          <p className="text-gray-600">{author.email}</p>
          <Link
            href={`/admin/authors/editAuthors/${id}`}
            className="inline-block px-4 py-2 mb-4 text-white bg-blue-600 hover:bg-blue-700 rounded mt-3"
          >
            Edit Author
          </Link>
        </div>
      </div>

      {/* All Fields */}
      <div className="space-y-3 mb-8">
        
        <p><span className="font-semibold">Mobile:</span> {author.mobile}</p>
        <p><span className="font-semibold">Date of Birth:</span> {author.dob}</p>
        <p><span className="font-semibold">Date of Death:</span> {author.dod}</p>
        
        
      </div>

      {/* Descriptions */}
      <h3 className="font-semibold">Description (English):</h3>
      <p className="text-gray-700 mb-6">{author.description || "N/A"}</p>

      <h3 className="font-semibold">Description (Bangla):</h3>
      <p className="text-gray-700 mb-6">{author.descriptionBn || "N/A"}</p>

      {/* Books */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Books by {author.nameBn}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {authorBooks.length > 0 ? (
          authorBooks.map((book, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border rounded-lg p-3 text-center"
            >
              <img
                src={book.cover?.url || "/no-cover.png"}
                alt={book.title?.bn || "Untitled"}
                className="w-full h-36 object-contain rounded"
              />
              <p className="mt-2 text-sm text-gray-800 font-medium">
                {book.title?.bn || "Untitled"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No books available</p>
        )}
      </div>
    </div>
  );
}
