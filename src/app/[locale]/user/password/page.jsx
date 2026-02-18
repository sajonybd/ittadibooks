"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  // const { locale } = useRouter();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/update-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    if (data.message === "Password updated successfully") {
      window.location.reload();
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-2 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <span
              className="absolute right-3 top-[11px] cursor-pointer text-sm text-blue-600"
              onClick={() => setShowCurrent((prev) => !prev)}
            >
              {showCurrent ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <span
              className="absolute right-3 top-[11px] cursor-pointer text-sm text-blue-600"
              onClick={() => setShowNew((prev) => !prev)}
            >
              {showNew ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#51acec] text-white px-4 py-2 rounded "
        >
          Update Password
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm text-center text-red-600">{message}</p>
      )}
    </div>
  );
}
