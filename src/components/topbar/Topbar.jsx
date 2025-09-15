"use client";
import Link from "next/link";
import "./topbar.css";

export default function Topbar() {
  

  return (
    <header className="topbar">
      <nav className="flex space-x-4">
        <Link href="/changepassword" className="btn-primary">
          Change Password
        </Link>
        <Link href="/logout" className="btn-danger">
          Logout
        </Link>
      </nav>

      
    </header>
  );
}
