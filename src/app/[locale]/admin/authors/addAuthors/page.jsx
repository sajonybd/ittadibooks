

"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateInput from "@/app/components/CustomDateInput";
 

export default function AddAuthorPage() {
  const router = useRouter();
  const [dobDate, setDobDate] = useState(null);
  const [dodDate, setDodDate] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    nameBn: "",
    description: "",
    descriptionBn: "",
    image: null,
    previewImage: "",
    mobile: "",
    email: "",
    dob: "",
    dod: "",
  });

  const { locale } = useParams();

  // handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.length > 0) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewImage: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("nameBn", formData.nameBn);
    data.append("description", formData.description);
    data.append("descriptionBn", formData.descriptionBn);
    data.append("mobile", formData.mobile);
    data.append("email", formData.email);
    data.append("dob", formData.dob);
    data.append("dod", formData.dod);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/authors/addAuthor`,
        {
          method: "POST",
          body: data,
        }
      );

      if (res.ok) {
        router.push("/admin/authors");
      } else {
        alert("Failed to add Author");
      }
    } catch (error) {
      // // console.error("Error submitting form:", error);
    }
  };

  const handleClearImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      previewImage: "",
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-2">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Author</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name fields */}
        <div className="flex gap-4">
          <div className="w-full">
            <label className="block mb-1 font-medium">
              Author Name (English)
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 font-medium">
              Author Name (বাংলা)
            </label>
            <input
              type="text"
              name="nameBn"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Contact info */}
        <div className="flex gap-4">
          <div className="w-full">
            <label className="block mb-1 font-medium">Mobile Number</label>
            <input
              type="text"
              name="mobile"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="+8801XXXXXXXXX"
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="author@email.com"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="flex gap-4">
          <div className="w-full">
            <label className="block mb-1 font-medium">Date of Birth</label>
            <DatePicker
              selected={dobDate}
              onChange={(date) => {
                setDobDate(date);
                if (date) {
                  const formattedDate = new Intl.DateTimeFormat("en-GB").format(
                    date
                  );
                  setFormData((prev) => ({ ...prev, dob: formattedDate }));
                } else {
                  setFormData((prev) => ({ ...prev, dob: "" }));
                }
              }}
              dateFormat="dd/MM/yyyy"
              customInput={<CustomDateInput />}
              wrapperClassName="w-full"
              className="border-2 border-gray-300 py-2 px-4 rounded-lg w-full"
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 font-medium">Date of Death</label>
            <DatePicker
              selected={dodDate}
              onChange={(date) => {
                setDodDate(date);
                if (date) {
                  const formattedDate = new Intl.DateTimeFormat("en-GB").format(
                    date
                  );
                  setFormData((prev) => ({ ...prev, dod: formattedDate }));
                } else {
                  setFormData((prev) => ({ ...prev, dod: "" }));
                }
              }}
              dateFormat="dd/MM/yyyy"
              customInput={<CustomDateInput />}
              wrapperClassName="w-full"
              className="border-2 border-gray-300 py-2 px-4 rounded-lg w-full"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className="block mb-1 font-medium">
            Description (English)
          </label>
          <textarea
            name="description"
            rows="4"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description (বাংলা)</label>
          <textarea
            name="descriptionBn"
            rows="4"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1 font-medium">Author Image</label>
          {formData.previewImage && (
            <div className="mb-2 flex items-center gap-4">
              <img
                src={formData.previewImage}
                alt="Preview"
                className="h-24 rounded border"
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="text-red-600 underline"
              >
                Remove
              </button>
            </div>
          )}

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="border-2 border-dashed p-2 w-full rounded cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Author
        </button>
      </form>
    </div>
  );
}
