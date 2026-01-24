"use client";

import { usePathname } from "next/navigation";

export default function PageWrapper({ children }) {
  const pathname = usePathname();

  // Check if it's admin route
  const isAdmin = pathname.startsWith("/en/admin") || pathname.startsWith("/bn/admin");

  return (
    <div className={isAdmin ? "bg-gray-200" : "xl:px-16 2xl:px-32 md:px-10 px-4 bg-gray-200"}>
      {children}
    </div>
  );
}
