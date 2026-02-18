"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import axios from "axios";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Ensure this CSS file handles any custom Swiper bullet colors/positioning
import "./styleNew.css";


export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/banner/get`);
        // Basic validation to ensure we're setting an array
        setBanners(Array.isArray(res.data.banners) ? res.data.banners : []);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Skeleton loader to prevent Cumulative Layout Shift (CLS)
  if (loading) {
    return <div className="w-full h-[120px] md:h-[234px] lg:h-[340px] bg-gray-200 animate-pulse rounded-xl" />;
  }

  if (banners.length === 0) return null;

  return (
    <div className="w-full mb-2 group">
      <Swiper
        spaceBetween={10} // Reduced for mobile
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true, // Good for many slides
        }}
        navigation={true} // Swiper's default arrows
        loop={banners.length > 1}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper rounded-md lg:rounded-xl overflow-hidden"
        // Responsive breakpoints if you want to change behavior per device
        breakpoints={{
          1024: {
            spaceBetween: 30,
          },
        }}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner._id}>
            <div className="relative w-full h-[150px] sm:h-[200px] md:h-[280px] lg:h-[340px] xl:h-[400px]">
              <Image
                src={banner.imageUrl}
                alt={`Banner ${index + 1}`}
                fill
                priority={index === 0} // Prioritize only the first image
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1440px"
                className="object-cover object-center"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}