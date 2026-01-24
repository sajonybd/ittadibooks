"use client";

import React, {  useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

const SingleBlog = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/getBlog/${id}`);
                setBlog(res.data);
            } catch (err) {
                // // console.error(err);
                setError("Failed to load blog");
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (!blog) return null;

    return (
        <div className=" mx-auto  lg:px-5 py-5 px-3  bg-white shadow-md rounded-md">
            <h1 className="lg:text-4xl text-2xl font-bold mb-5">{blog.title}</h1>

            {/* Blog content: render HTML */}
            <div
                className="prose tiptap max-w-full"
                dangerouslySetInnerHTML={{ __html: blog.html }}
            ></div>

            {/* Optional: Display images separately if needed */}
            {blog.images && blog.images.length > 0 && (
                <div className="mt-5">
                    <h2 className="text-2xl font-semibold mb-3">Images</h2>
                    <div className="flex flex-wrap gap-3">
                        {blog.images.map((img, index) => (
                            <img
                                key={index}
                                src={img.url}
                                alt={`Blog image ${index + 1}`}
                                className="max-w-full rounded-md"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SingleBlog;
