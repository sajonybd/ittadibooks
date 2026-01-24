

"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styleNew.css";

// Import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import axios from "axios";

export default function BannerSlider() {
  
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/banner/get`
        );
        setBanners(res.data.banners);
         
      } catch {
        
      }
    };
    fetchImages();
  }, []);
  return (
    <div className="w-full mb-10">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        
        loop={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper rounded-md lg:rounded-xl overflow-hidden"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div className="relative w-full h-[120px] md:h-[234px] lg:h-[220px] xl:h-[340px] 2xl:h-[350px] banner-5xl banner-4xl">
              <Image
                src={banner.imageUrl}
                alt={`Banner ${banner.id}`}
                fill
                priority={banner._id === 1}
                className="object-cover object-center"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
