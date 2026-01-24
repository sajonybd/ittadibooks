"use client";
import { usePathname } from "next/navigation";
import React from "react";

export default function WhatsAppButton() {
  const pathname = usePathname();
  
  if(pathname.startsWith("/bn/admin")) return null; // Hide on admin pages
  return (
    <a
      href="https://wa.me/8801735393639" // replace with your WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-10 right-2 lg:right-5 z-50 bg-[#25D366] hover:bg-[#1ebe5d] p-3 rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="white"
        viewBox="0 0 24 24"
      >
        <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12a11.92 11.92 0 001.64 6.03L0 24l6.28-1.63A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.24-6.19-3.48-8.52zM12 22.12a10.13 10.13 0 01-5.38-1.52l-.38-.23-3.73.97.99-3.63-.25-.38A10.14 10.14 0 011.88 12c0-5.55 4.52-10.07 10.12-10.07 2.7 0 5.23 1.05 7.12 2.96A10.12 10.12 0 0122.12 12c0 5.57-4.53 10.12-10.12 10.12zM17.21 14.6c-.28-.14-1.64-.81-1.89-.9-.25-.09-.44-.14-.63.14-.19.28-.73.9-.9 1.08-.16.19-.32.21-.6.07-.28-.14-1.18-.43-2.25-1.38-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.31.42-.46.14-.16.19-.28.28-.47.09-.19.05-.36-.02-.5-.07-.14-.63-1.52-.86-2.09-.23-.55-.46-.48-.63-.49-.16-.01-.36-.01-.55-.01s-.5.07-.76.36c-.25.28-.95.92-.95 2.24s.98 2.6 1.12 2.78c.14.19 1.93 2.94 4.68 4.12.65.28 1.15.45 1.54.57.65.19 1.25.16 1.72.1.52-.07 1.64-.67 1.87-1.32.23-.65.23-1.21.16-1.32-.07-.1-.25-.16-.53-.3z" />
      </svg>
    </a>
  );
}
