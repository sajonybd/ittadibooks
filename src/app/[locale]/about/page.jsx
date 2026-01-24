"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function AboutUsPage() {
  const t = useTranslations("about");
  const [show, setShow] = useState(false);

  useEffect(() => {
    // simple fade-in animation trigger on mount
    setShow(true);
  }, []);

  return (
    <div className="px-6 md:px-20 py-20 bg-white font-sans min-h-screen">
      <div
        className={`max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12 transition-opacity duration-1000 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Text Section */}
        <div className="space-y-8 bg-gradient-to-r from-blue-50 to-white p-8 rounded-lg shadow-lg">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">
            {t("whoWeAreTitle") || "Who We Are"}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t("description")}
          </p>

          <div className="border-l-4 border-blue-500 pl-6 text-gray-700 bg-blue-50 py-5 pr-6 rounded-md shadow-sm">
            <p className="italic text-lg leading-relaxed font-serif">
              “{t("quote")}”
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-xl cursor-pointer transition-transform duration-300 hover:scale-105">
          <Image
            src="https://res.cloudinary.com/mdshihab/image/upload/v1754671581/slider-banners/btnqeceiuewivr75knqh.jpg"
            alt="About our book website"
            width={600}
            height={400}
            className="w-full h-full object-cover object-center rounded-xl"
            priority
          />
        </div>
      </div>
    </div>
  );
}
