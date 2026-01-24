"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editVideo, setEditVideo] = useState(null);
  const [formData, setFormData] = useState({ title: "", url: "" });

  // Load videos from API
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/videos/mainPage`);
      const data = await res.json();
      if (data.success) {
        setVideos(data.videos);
      }
    } catch (error) {
      // // console.error("Failed to fetch videos:", error);
    }
  };

  const handleOpen = (video = null) => {
    if (video) {
      setEditVideo(video);
      setFormData({ title: video.title, url: video.url });
    } else {
      setEditVideo(null);
      setFormData({ title: "", url: "" });
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.url) return;

    try {
      if (editVideo) {
        // Update existing video
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/videos/mainPage/edit/${editVideo._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Add new video
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/videos/mainPage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      setOpen(false);
      fetchVideos(); // reload
    } catch (error) {
      // // console.error("Failed to save video:", error);
    }
  };

 


const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this video?")) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/videos/mainPage/edit/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      setVideos(videos.filter((v) => v._id !== id));
      toast.success("Video deleted successfully!");
    } else {
      toast.error(data.message || "Failed to delete video.");
    }
  } catch (error) {
    // // console.error("Failed to delete video:", error);
    toast.error("Something went wrong. Try again!");
  }
};

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Video Page Management</h1>
        <button
          onClick={() => handleOpen()}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
        >
         Add Video
        </button>
      </div>

      {/* Videos grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className="border rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
          >
            <h2 className="font-semibold mb-2 line-clamp-2">{video.title}</h2>
            <iframe
              className="w-full rounded-lg mb-3"
              height="200"
              src={video.url.replace("watch?v=", "embed/")}
              title={video.title}
              allowFullScreen
            />
            <div className="flex justify-end gap-2 mt-auto">
              <button
                onClick={() => handleOpen(video)}
                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                ✏ Edit
              </button>
              <button
                onClick={() => handleDelete(video._id)}
                className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editVideo ? "Edit Video" : "Add New Video"}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Video Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              />
              <input
                type="text"
                placeholder="YouTube URL"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                {editVideo ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
