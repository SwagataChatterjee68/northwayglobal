"use client";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./manage-blog.css";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PermissionBox from "@/components/modal/Permission";

export default function ManageBlogs() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showPermission, setShowPermission] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      // 1. Updated the fetch URL to your new API endpoint
      const res = await fetch("https://nortway.mrshakil.com/api/blogs/blog/");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      } else {
        toast.error("Failed to fetch blogs");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Open modal for delete confirmation
  const confirmDelete = (id) => {
    setSelectedBlogId(id);
    setShowPermission(true);
  };

  // Execute delete when confirmed
  const handleDelete = async () => {
    if (!selectedBlogId) return;
    try {
      // 2. Updated the DELETE URL to match your API structure
      const res = await fetch(`/api/blogs/blog/${selectedBlogId}/`, {
        method: "DELETE",
        // Note: If your API requires authentication, you may need to add headers here
        // headers: { 'Authorization': `Bearer YOUR_TOKEN_HERE` }
      });

      // A successful DELETE often returns status 204 (No Content)
      if (res.ok) {
        setBlogs(blogs.filter((blog) => blog.id !== selectedBlogId));
        toast.success("Blog deleted successfully!");
      } else {
        toast.error("Failed to delete blog");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    } finally {
      setShowPermission(false);
      setSelectedBlogId(null);
    }
  };

  const handleUpdate = (blog_id) => {
    router.push(`update/${blog_id}`);
  };

  return (
    <div className="page-container">
      <main className="main-content">
        <h1 className="page-title">Manage Blogs</h1>

        <div className="table-wrapper">
          <table className="blogs-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Writer</th>
                {/* 3. Changed header from "Description" to "Summary" */}
                <th>Summary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>{blog.title}</td>
                    <td>{blog.writer}</td>
                    {/* 4. Changed blog.description to blog.short_summary */}
                    <td>{blog.short_summary}</td>
                    <td className="actions">
                      <button
                        className="btn-update"
                        onClick={() => handleUpdate(blog.id)}
                      >
                        <FaEdit /> Update
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => confirmDelete(blog.id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No blogs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* PermissionBox for delete */}
      <PermissionBox
        isOpen={showPermission}
        onConfirm={handleDelete}
        onCancel={() => setShowPermission(false)}
        action="delete"
      />
    </div>
  );
}