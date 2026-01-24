"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const AdminGalleryPage = () => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch all gallery images on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/gallery/getImages`);
        setImages(res.data.images || []);
      } catch (err) {
        // // console.error("Failed to fetch images:", err);
      }
    };
    fetchImages();
  }, []);

  // Handle file input change
  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // Upload images to backend
  const handleUpload = async () => {
    if (!files.length) return;
    setLoading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      if (caption) formData.append("caption", caption);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/gallery/addImages`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Add newly uploaded images to the start of the list
      setImages([...res.data.images, ...images]);
      setFiles([]);
      setCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      // // console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete an image by its ID
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/gallery/deleteImages?id=${id}`);
      setImages(images.filter((img) => img._id !== id));
    } catch (err) {
      // // console.error("Delete failed:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 relative">
      <h1 className="text-4xl font-bold mb-8 text-center">Gallery Admin</h1>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="text-white text-lg font-semibold">Uploading...</div>
        </div>
      )}

      {/* Upload Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={handleFiles}
          className="border p-2 rounded w-full md:w-auto"
        />
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption (optional)"
          className="border p-2 rounded flex-1 w-full"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {images.map((img) => (
          <div
            key={img._id}
            className="relative overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={img.src}
              alt={img.caption || "Gallery Image"}
              className="w-full h-48 object-cover"
            />
            {img.caption && (
              <div className="absolute bottom-0 bg-black bg-opacity-50 text-white text-sm p-1 w-full text-center">
                {img.caption}
              </div>
            )}
            <button
              onClick={() => handleDelete(img._id)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGalleryPage;
