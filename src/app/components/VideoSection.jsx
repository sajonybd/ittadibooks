import { useEffect, useState } from "react";

 

export default function VideoSection() {
  const [videos, setVideos] = useState([]);

  // Load videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/videos/homepage`);
        const data = await res.json();
        if (data.success) {
          setVideos(data.videos);
        }
      } catch (error) {
        // // console.error("Failed to fetch videos:", error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <section className=" ">
      <div className="flex items-center justify-between w-full h-full bg-[#51acec] px-5 py-3 rounded-lg mb-3 shadow-lg border-b-2 border-b-[#444444]">
        <h3 className="text-base lg:text-xl font-semibold">
          বই এবং লেখক গল্প (ভিডিও)
        </h3>
        <button
          onClick={() => {
            window.location.href = `/videos`; // Navigate to the page
          }}
          className="flex items-center lg:gap-1"
        >
          <span className="lg:text-lg text-sm">আরও দেখুন</span>
          <span className="text-[#1f1f1f]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              className="w-4 h-4 lg:w-6 lg:h-6"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14m-6 6l6-6m-6-6l6 6"
              ></path>
            </svg>
          </span>
        </button>
      </div>
      <div className="max-w-6xl mx-auto">
        {/* Video Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.slice(0, 5).map((video,idx) => (
            <a
              key={idx}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition"
            >
              
              <img
                src={`https://img.youtube.com/vi/${
                  video.url.split("v=")[1]
                }/hqdefault.jpg`}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <p className="p-2 text-sm font-medium">{video.title}</p>
            </a>
          ))}
        </div>

        
      </div>
    </section>
  );
}
