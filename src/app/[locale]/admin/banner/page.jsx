"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";

export default function AdminSliderImagesPage() {
  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch images on load
  useEffect(() => {
    fetchImages();
  }, []);
  const { locale } = useParams();
  const fetchImages = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/banner/get`
      );
      setImages(res.data.banners || []);
    } catch {
      toast.error("Failed to load images");
    }
  };

  // Upload new image
  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/banner/add`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        toast.success("Image added");
        setImageFile(null);
        fetchImages();
      } else {
        toast.error("Failed to add image");
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete image by ID
  const handleDelete = async (id) => {
    if (!confirm("Delete this image?")) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/banner/delete/${id}`
      );
      if (res.data.success) {
        toast.success("Image deleted");
        setImages(images.filter((img) => img._id !== id));
      } else {
        toast.error("Failed to delete image");
      }
    } catch {
      toast.error("Error deleting image");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Slider Images</h1>

      <form onSubmit={handleAddImage} className="mb-8">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          disabled={isSubmitting}
          className="mb-3 border-2 border-dashed p-2  rounded cursor-pointer"
        />
        <br />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Uploading..." : "Add Image"}
        </button>
      </form>

      <div className="grid grid-cols-3 gap-4">
        {images.length === 0 && <p>No images uploaded yet.</p>}
        {images.map(({ _id, imageUrl }) => (
          <div key={_id} className="relative border rounded overflow-hidden">
            <img
              src={imageUrl}
              alt="Slider Image"
              className="w-full h-32 object-cover"
            />
            <button
              onClick={() => handleDelete(_id)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded px-2 py-1 hover:bg-red-700"
              title="Delete Image"
              type="button"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
