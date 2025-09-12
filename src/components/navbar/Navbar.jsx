"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaPlus,
  FaBlog,
  FaVideo,
  FaImages,
  FaQuoteRight,
  FaRegEdit,
} from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import "./navbar.css"

const menuItems = [
  { name: "Create Blog", icon: FaPlus, href: "/create" },
  { name: "Manage Blog", icon: FaBlog, href: "/manage-blog" },
  { name: "Manage Video Gallery", icon: FaVideo, href: "/dashboard/manage-videos" },
  { name: "Manage Photo Gallery", icon: FaImages, href: "/dashboard/manage-photos" },
  { name: "Testimonials", icon: FaQuoteRight, href: "/dashboard/testimonials" },
  { name: "Manage Testimonials", icon: FaRegEdit, href: "/dashboard/manage-testimonials" },
];

export default function DashboardNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar hidden md:flex flex-col fixed top-0 left-0 h-full w-64 bg-gray-100 p-6">
        <h2 className="sidebar-title mb-6">Dashboard</h2>
        <nav className="sidebar-nav flex flex-col gap-3">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href} className="sidebar-item flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200">
              <item.icon className="text-gray-600" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-gray-100 rounded shadow">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <aside className="sidebar-mobile fixed top-0 left-0 h-full w-64 bg-gray-100 p-6 z-40 md:hidden">
          <h2 className="sidebar-title mb-6">Dashboard</h2>
          <nav className="sidebar-nav flex flex-col gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="sidebar-item flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="text-gray-600" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>
      )}
    </>
  );
}
