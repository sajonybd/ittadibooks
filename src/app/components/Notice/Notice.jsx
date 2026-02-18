"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

export default function Notice() {
   const [notice, setNotice] = useState("");
    useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notice`);
        if (res.data?.message) setNotice(res.data.message);
      } catch (error) {
        // // console.error("Error fetching notice:", error);
      }
    };
    fetchNotice();
  }, []);
  return (
    <Marquee
      speed={30}
      className="text-lg text-black bg-[#51acec] p-3 mb-3"
    >
      {notice && notice}
      {/* ২৩ বছরে ইত্যাদি গ্রন্থপ্রকাশ। সকল লেখক, পাঠক ও শুভানুধ্যায়ীকে জানাই
      শুভেচ্ছা ও অভিনন্দন। আমাদের সাথেই থাকুন। শিগগিরই নতুন নতুন চমক নিয়ে হাজির
      হচ্ছে ইত্যাদি গ্রন্থপ্রকাশ। */}
    </Marquee>
  );
}
