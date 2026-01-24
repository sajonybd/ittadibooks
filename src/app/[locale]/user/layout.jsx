

"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import "@/app/globals.css";

export default function UserDashboardLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const latsPath = pathname.split("/").pop();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row md:px-10 lg:px-20">
      {/* Mobile Navbar */}
      <div className="flex items-center justify-between p-4 border-b bg-white lg:hidden">
        <div className="flex items-center gap-2">
          <Image
            src={session?.user?.image || "/assets/images/profile/profile.png"}
            alt="Profile"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="font-medium text-gray-800">{session?.user?.name || "User"}</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-700 text-2xl">
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } lg:block w-full lg:w-72 bg-gray-100 p-4 border-b lg:border-r border-gray-300`}
      >
       

        <nav className="space-y-8">
          <Link
            href="/user"
            className={`${
              latsPath === "user" && "bg-[#51acec] text-white"
            } text-lg font-medium text-gray-800 flex items-center gap-2 p-2`}
            onClick={() => setSidebarOpen(false)}
          >
            {/* Home Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M6 19h3.692v-5.077q0-.343.233-.575q.232-.233.575-.233h3q.343 0 .576.233q.232.232.232.575V19H18v-8.692q0-.154-.067-.28t-.183-.22L12.366 5.75q-.154-.134-.366-.134t-.365.134L6.25 9.808q-.115.096-.183.22t-.067.28zm-1 0v-8.692q0-.384.172-.727t.474-.565l5.385-4.078q.423-.323.966-.323t.972.323l5.385 4.077q.303.222.474.566q.172.343.172.727V19q0 .402-.299.701T18 20h-3.884q-.344 0-.576-.232q-.232-.233-.232-.576v-5.076h-2.616v5.076q0 .344-.232.576T9.885 20H6q-.402 0-.701-.299T5 19m7-6.711"
              ></path>
            </svg>
            Dashboard Home
          </Link>

          <Link
            href="/user/my-orders"
            className={`${
              latsPath === "my-orders" && "bg-[#51acec] text-white"
            } flex items-center gap-2 p-2 text-lg font-medium text-gray-800`}
            onClick={() => setSidebarOpen(false)}
          >
            {/* Orders Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeWidth={1}>
                <rect width={14} height={17} x={5} y={4} rx={2}></rect>
                <path strokeLinecap="round" d="M9 9h6m-6 4h6m-6 4h4"></path>
              </g>
            </svg>
            My Orders
          </Link>

          <Link
            href="/user/wishlist"
            className={`${
              latsPath === "wishlist" && "bg-[#51acec] text-white"
            } flex items-center gap-2 p-2 text-lg font-medium text-gray-800`}
            onClick={() => setSidebarOpen(false)}
          >
            {/* Wishlist Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M19.285 12.645a3.8 3.8 0 0 0-5.416-5.332q-.288.288-.732.707l-.823.775l-.823-.775q-.445-.42-.733-.707a3.8 3.8 0 0 0-5.374 0c-1.468 1.469-1.485 3.844-.054 5.32l6.984 6.984l6.97-6.972zm-14.75-6.18a5 5 0 0 1 7.072 0q.273.274.707.682q.432-.408.707-.683a5 5 0 0 1 7.125 7.017l-7.125 7.126a1 1 0 0 1-1.414 0L4.48 13.48a5 5 0 0 1 .055-7.017z"
              ></path>
            </svg>
            Wishlist
          </Link>

          <Link
            href="/user/profile"
            className={`${
              latsPath === "profile" && "bg-[#51acec] text-white"
            } flex items-center gap-2 p-2 text-lg font-medium text-gray-800`}
            onClick={() => setSidebarOpen(false)}
          >
            {/* Profile Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinejoin="round"
                  d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                ></path>
                <circle cx={12} cy={7} r={3}></circle>
              </g>
            </svg>
            Profile
          </Link>

          <Link
            href="/user/password"
            className={`${
              latsPath === "password" && "bg-[#51acec] text-white"
            } flex items-center gap-2 p-2 text-lg font-medium text-gray-800`}
            onClick={() => setSidebarOpen(false)}
          >
            {/* Password Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 17a2 2 0 0 1-2-2c0-1.11.89-2 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2m6 3V10H6v10zm0-12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.11.89-2 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"
              ></path>
            </svg>
            Password
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 w-full text-left text-lg font-medium text-red-600 hover:underline pt-2"
          >
            {/* Logout Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M5 3h6a3 3 0 0 1 3 3v4h-1V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4h1v4a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3m3 9h11.25L16 8.75l.66-.75l4.5 4.5l-4.5 4.5l-.66-.75L19.25 13H8z"
              ></path>
            </svg>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
