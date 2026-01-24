"use client";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function AdminTopbar({ toggleSidebar }) {
  const session = useSession();
  return (
    <header className="bg-white shadow px-6 py-4 flex items-center w-full justify-between">
       {/* Mobile Sidebar Toggle */}
      <button onClick={toggleSidebar} className="md:hidden p-2">
        <Menu className="w-6 h-6" />
      </button>
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      <div className="flex items-center gap-3">
        <span className="text-gray-600">Admin</span>
        <Image
          src={session?.data?.user?.image||"/assets/images/profile/profile.png"}
          alt="admin avatar"
          width={32}
          height={32}
          className="rounded-full"
        />
      </div>
    </header>
  );
}
