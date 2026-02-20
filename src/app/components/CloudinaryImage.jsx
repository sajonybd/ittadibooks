"use client";

import Image from "next/image";

/**
 * Custom loader for Cloudinary that bypasses the Next.js image proxy.
 * This loads the image directly from Cloudinary while still providing
 * quality and format optimizations.
 */
const cloudinaryLoader = ({ src, width, quality }) => {
  // If the src is not a Cloudinary URL, return as is (fallback)
  if (!src.includes("cloudinary.com")) {
    return src;
  }

  // Cloudinary optimization parameters
  // f_auto: automatic format (WebP/AVIF)
  // q_auto: automatic quality
  // c_limit: resize to fit within width/height but don't upscale
  // w_: width
  const params = [
    "f_auto",
    "q_auto",
    `c_limit`,
    `w_${width}`,
  ].join(",");

  /**
   * Cloudinary URLs usually look like:
   * https://res.cloudinary.com/cloud_name/image/upload/v1234567/folder/image.jpg
   * We want to insert our params after /upload/
   */
  if (src.includes("/upload/")) {
    return src.replace("/upload/", `/upload/${params}/`);
  }

  return src;
};

const CloudinaryImage = (props) => {
  return (
    <Image
      loader={cloudinaryLoader}
      {...props}
      // Ensure we don't pass an unoptimized flag if we want the loader to work
      unoptimized={false}
    />
  );
};

export default CloudinaryImage;
