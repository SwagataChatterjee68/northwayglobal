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
      <aside className="sidebar hidden md:flex flex-col fixed top-0 left-0 h-full w-64">
        
        <img src="/logo.jpeg" className="logo"  />
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href} className="sidebar-item">
              <item.icon className="sidebar-icon" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="menu-toggle"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <aside className="sidebar-mobile md:hidden">
          <h2 className="sidebar-title">Dashboard</h2>
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="sidebar-item"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="sidebar-icon" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>
      )}
    </>
  );
}
