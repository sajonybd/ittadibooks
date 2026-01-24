"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const GalleryPage = () => {
  const [images, setImages] = useState([]);

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
  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Gallery
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={src.src}
              alt={`Gallery Image ${index + 1}`}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-[#51acec] bg-opacity-20 opacity-0 hover:opacity-100 transition duration-300 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {src.caption}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
