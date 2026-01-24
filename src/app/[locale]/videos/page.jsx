"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function VideoSection() {
  const [videos, setVideos] = useState([]);

  // Fetch videos from your backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/videos/mainPage`);
        const data = await res.json();
        if (data.success) {
          setVideos(data.videos);
        }
      } catch (error) {
        // // console.error("❌ Failed to fetch videos:", error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <section className="max-w-7xl mx-auto  py-10 min-h-screen">
      {/* Header Bar */}
       <div className="text-center mb-10">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-2">
            বই এবং লেখক গল্প (ভিডিও)
          </h1>
          <p className="text-gray-600 text-lg"></p>
        </div>
      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.length > 0 ? (
          videos.slice(0, 8).map((video, idx) => {
            // Extract YouTube video ID safely
            const videoId =
              video.url.includes("v=")
                ? video.url.split("v=")[1]?.split("&")[0]
                : video.url.split("/").pop();

            const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            return (
              <motion.a
                key={idx}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="group rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-[#51acec] shadow-md hover:shadow-lg transition-all"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={thumbnail}
                    alt={video.title || "Book video"}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="white"
                      className="w-10 h-10 opacity-80 group-hover:opacity-100"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 group-hover:text-[#51acec] line-clamp-2">
                    {video.title || "ভিডিও শিরোনাম"}
                  </p>
                </div>
              </motion.a>
            );
          })
        ) : (
          <p className="col-span-4 text-center text-gray-500">
            🎥 কোনো ভিডিও পাওয়া যায়নি।
          </p>
        )}
      </div>
    </section>
  );
}
