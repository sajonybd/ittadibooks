"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AdminNoticePage() {
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/notice`);
        if (res.data?.message) setNotice(res.data.message);
      } catch (error) {
        // // console.error("Error fetching notice:", error);
      }
    };
    fetchNotice();
  }, []);
 
  const handleSave = async () => {
    if (!notice.trim()) {
      toast.error("নোটিশ ফাঁকা রাখা যাবে না");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/notice`, { message: notice });
      toast.success("নোটিশ সফলভাবে আপডেট হয়েছে!");
    } catch (error) {
      // // console.error("Error updating notice:", error);
      toast.error("নোটিশ আপডেট করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-5 text-center">
       নোটিশ ব্যবস্থাপনা
      </h1>

      <div className="bg-white shadow rounded-2xl p-5 border border-gray-200">
        <textarea
          className="w-full h-40 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={notice}
          onChange={(e) => setNotice(e.target.value)}
          placeholder="এখানে আপনার নোটিশ লিখুন..."
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "সংরক্ষণ হচ্ছে..." : "নোটিশ সংরক্ষণ করুন"}
          </button>
        </div>
      </div>
    </div>
  );
}
