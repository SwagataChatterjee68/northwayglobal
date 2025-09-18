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
import "./navbar.css";

const menuItems = [
  { name: "Create Blog", icon: FaPlus, href: "/create" },
  { name: "Manage Blog", icon: FaBlog, href: "/manage" },
  { name: "Manage Video Gallery", icon: FaVideo, href: "/manage-video" },
  { name: "Manage Photo Gallery", icon: FaImages, href: "/manage-photo" },
  { name: "Testimonials", icon: FaQuoteRight, href: "/create-testimonial" },
  { name: "Manage Testimonials", icon: FaRegEdit, href: "/manage-testimonial" },
];

export default function DashboardNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="p-10 fixed top-0 left-0 w-auto z-50 ">
      {/* Logo */}
      <div className="mb-10">
        <img src="/logo.jpeg" className="logo " alt="Logo" />
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col  space-y-8 ">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center text-black/80 hover:bg-[#FF9100] hover:text-white hover:py-2 hover:px-4 rounded space-x-2 transition-all duration-300 ease-in-out  "
          >
            <item.icon className="sidebar-icon" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Mobile Toggle Button */}
      {/* <div className="md:hidden absolute top-4 left-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded bg-gray-200"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div> */}

      {/* Mobile Sidebar */}
      {/* {isOpen && (
        <div className="md:hidden absolute top-0 left-0 w-64 h-screen bg-white shadow-lg p-4 z-50">
          <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
          <nav className="flex flex-col space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 hover:text-green-600"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="sidebar-icon" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      )} */}
    </aside>
  );
}
