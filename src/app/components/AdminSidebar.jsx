 

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Settings,
  Users,
  BookOpen,
  Tags,
  ListChecks,
  User,
  ChevronDown,
  ChevronUp,
  Megaphone,
  Image,
  Video,
   
  Flag,
  Dock,
  HomeIcon,
  LayoutDashboard,
  Sliders
} from "lucide-react";

const links = [
  { name: "Home", href: "/", icon: <HomeIcon size={18} /> },
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
  { name: "Notice", href: "/admin/notice", icon: <Flag size={18} /> },
  { name: "Banner", href: "/admin/banner", icon: <Megaphone size={18} /> },
  { name: "Gallery", href: "/admin/gallery/images", icon: <Image size={18} /> },
   { name: "Categories", href: "/admin/categories", icon: <Tags size={18} /> },
   { name: "Orders", href: "/admin/orders", icon: <ListChecks size={18} /> },
   { name: "Homepage Sliders", href: "/admin/homepage-collections", icon: <Sliders size={18} /> },
  {
    name: "Blog",
    // href: "/admin/blog",
    icon: <Dock size={18} />,
    subLinks: [
      { name: "All Post", href: "/admin/blog" },
      { name: "Add Blog", href: "/admin/blog/add" },
    ],
  },
  {
    name: "Video",
    href: "/admin/video",
    icon: <Video size={18} />,
    subLinks: [
      { name: "Homepage Section", href: "/admin/video" },
      { name: "Videos Page", href: "/admin/videosPage" },
    ],
  },

  {
    name: "Users",
    href: "/admin/users",
    icon: <Users size={18} />,
    subLinks: [
      { name: "All Users", href: "/admin/users" },
      // { name: 'Add New User', href: '/admin/users/add' },
    ],
  },

 

  {
    name: "Authors",
    href: "/admin/authors",
    icon: <User size={18} />,
    subLinks: [
      { name: "All Authors", href: "/admin/authors" },
      { name: "Add New Author", href: "/admin/authors/addAuthors" },
    ],
  },

 

  {
    name: "Books",
    href: "/admin/books",
    icon: <BookOpen size={18} />,
    subLinks: [
      { name: "All Books", href: "/admin/books" },
      { name: "Add New Book", href: "/admin/books/addBooks" },
      { name: "Promo Code", href: "/admin/promoCode" },
    ],
  },

  { name: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside className="w-64 bg-white shadow-md h-screen sticky top-0 p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold text-[#51acec] mb-8">Admin Panel</h2>
      <nav className="space-y-3">
        {links.map(({ name, href, icon, subLinks }) => {
          const isActive =
            pathname === href ||
            (subLinks && subLinks.some((sl) => pathname === sl.href));
          return (
            <div key={name}>
              <button
                type="button"
                onClick={() => (subLinks ? toggleMenu(name) : null)}
                className={`flex items-center justify-between w-full gap-3 px-4 py-2 rounded-md font-medium text-gray-700 transition hover:bg-indigo-100 ${
                  isActive ? "bg-indigo-500 text-white" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {icon}
                  {subLinks ? (
                    <span>{name}</span>
                  ) : (
                    <Link href={href}>{name}</Link>
                  )}
                </div>

                {subLinks && (
                  <span>
                    {openMenus[name] ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </span>
                )}
              </button>

              {/* Submenu */}
              {subLinks && openMenus[name] && (
                <div className="ml-8 mt-1 flex flex-col space-y-1">
                  {subLinks.map((subLink) => (
                    <Link
                      key={subLink.href}
                      href={subLink.href}
                      className={`px-3 py-1 rounded text-gray-600 hover:bg-indigo-100 transition ${
                        pathname === subLink.href
                          ? "bg-indigo-400 text-white"
                          : ""
                      }`}
                    >
                      {subLink.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
