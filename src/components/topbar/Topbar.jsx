"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import "./topbar.css";

export default function Topbar() {
  const router = useRouter();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    // Check if token exists
    if (!token) {
      toast.error("You are not logged in");
      router.push("/login");
      return;
    }

    try {
      // Send GET request with correct Authorization header
      const res = await fetch("https://nortway.mrshakil.com/api/auth/logout/", {
        method: "GET", 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Success: remove token and redirect
        localStorage.removeItem("token");
        toast.success("Logged out successfully!");
        router.push("/login");
      } else {
        // If server rejects, read error details
        let errData;
        try {
          errData = await res.json();
        } catch {
          errData = { detail: "Server returned an error" };
        }

        // Handle common cases
        if (res.status === 401 || res.status === 403) {
          toast.error("Invalid or expired token. Please login again.");
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          toast.error(errData.detail || "Failed to logout");
        }
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Error connecting to server");
    }
  };

  return (
    <header className="topbar p-4 bg-gray-800 text-white">
      <nav className="flex space-x-4 justify-end">
        <Link href="/changepassword" className="btn-primary">
          Change Password
        </Link>
        <button
          onClick={handleLogout}
          className="btn-danger"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
