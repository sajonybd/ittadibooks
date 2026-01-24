"use client";
import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./customStyle.css";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

 

const autoplay = (slider) => {
  let timeout;
  let mouseOver = false;

  function clearNextTimeout() {
    clearTimeout(timeout);
  }

  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      if (slider && slider.next) {
        slider.next(); // Only call if instance exists
      }
    }, 3000);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });

  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
};


export default function CustomKeenSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [banners, setBanners] = useState([]);
  // const { locale } = useRouter();
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
 
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      initial: 0,
      loop: true,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
    },
    [autoplay]
  );
useEffect(() => {
  return () => {
    clearTimeout(timeout);
  };
}, []);

  

  return (
    <>
      <div className="navigation-wrapper  mb-10 bannerSlider">
    
        {banners.length === 1 ? (
       
        <div></div>
        ) : (
          
          <div
            ref={sliderRef}
            className="keen-slider h-[120px] md:h-[250px] lg:h-[350px] rounded-md lg:rounded-xl"
          >
            {banners.map((banner, index) => (
              <div key={index} className="keen-slider__slide w-full h-full">
                 
                <Image
                  src={"/assets/images/test.png"}
                  width={2560}
                  height={1053}
                  alt={`Slide ${index + 1}`}
                  priority={index === 0} // first image loads immediately
                  placeholder="blur"
                  blurDataURL="/blur-placeholder.png" // tiny base64/placeholder
                  sizes="(max-width: 768px) 100vw, 
         (max-width: 1200px) 100vw, 
         2560px"
                  loading={index === 0 ? "eager" : "lazy"} // only first loads eagerly
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
 