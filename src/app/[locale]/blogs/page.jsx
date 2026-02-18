"use client";

import React, { useEffect, useState } from "react";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`);
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        // // console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p className="text-center mt-2">Loading blogs...</p>;
  if (!blogs.length) return <p className="text-center mt-2">No blogs available.</p>;

  return (
    <div className=" lg:px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Blog</h1>
      <div className="tiptap grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {blog.title || "Untitled Blog"}
            </h2>
            <p className="text-gray-700 mb-4 line-clamp-4">
              {blog.html.replace(/<[^>]+>/g, "") || "No content available."}
            </p>
            <a
              href={`/blogs/${blog._id}`}
              className="text-blue-600 hover:underline font-medium"
            >
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
