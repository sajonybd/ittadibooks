
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import ShowContentForBlogs from "@/app/components/blog/ShowContentForBlogs";

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: "title", direction: "asc" });

    // Fetch all blogs
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/blog/allBlog`);
                let fetchedBlogs = res.data || [];

                // Default sort by Bangla alphabetical order
                fetchedBlogs.sort((a, b) =>
                    a.title.localeCompare(b.title, "bn", { sensitivity: "base" })
                );

                setBlogs(fetchedBlogs);
            } catch (err) {
                // // console.error(err);
                toast.error("Failed to fetch blogs");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    // Delete blog
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;

        setDeletingId(id);
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/blog/delete/${id}`);
            setBlogs((prev) => prev.filter((b) => b._id !== id));
            toast.success("Blog deleted successfully");
        } catch (err) {
            // // console.error(err);
            toast.error("Failed to delete blog");
        } finally {
            setDeletingId(null);
        }
    };

    // Sort handler
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sorted = [...blogs].sort((a, b) => {
            if (key === "title") {
                return direction === "asc"
                    ? a.title.localeCompare(b.title, "bn", { sensitivity: "base" })
                    : b.title.localeCompare(a.title, "bn", { sensitivity: "base" });
            }
            if (key === "createdAt") {
                return direction === "asc"
                    ? new Date(a.createdAt) - new Date(b.createdAt)
                    : new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0;
        });

        setBlogs(sorted);
        setSortConfig({ key, direction });
    };

    const [post, setPost] = useState("");

    const showContent = (id) => {
        const blog = blogs.find(b => b._id === id);
        if (blog) {
            setPost(blog.html);
        }
        document.getElementById('my_modal_1').showModal();
    }


    if (loading) return <p className="p-4">Loading blogs...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Blogs</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th
                                className="px-4 py-2 border cursor-pointer"
                                onClick={() => handleSort("title")}
                            >
                                Title {sortConfig.key === "title" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                            </th>
                            <th
                                className="px-4 py-2 border cursor-pointer"
                                onClick={() => handleSort("createdAt")}
                            >
                                Created At {sortConfig.key === "createdAt" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                            </th>
                            <th className="px-4 py-2 border w-[300px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((blog, index) => (
                            <tr key={blog._id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border">{index + 1}</td>
                                <td className="px-4 py-2 border">{blog.title}</td>
                                <td className="px-4 py-2 border">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 border flex gap-2">
                                    <Link
                                        href={`/admin/blog/edit/${blog._id}`}
                                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(blog._id)}
                                        disabled={deletingId === blog._id}
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                    >
                                        {deletingId === blog._id ? "Deleting..." : "Delete"}
                                    </button>
                                    <button

                                        onClick={() => showContent(blog._id)}
                                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {blogs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-4">
                                    No blogs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ShowContentForBlogs content={post} />
        </div>
    );
}
