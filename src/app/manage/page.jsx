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

  // modal state
  const [showPermission, setShowPermission] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://json-server-lnkp.onrender.com/blogs");
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

  // open modal for delete
  const confirmDelete = (id) => {
    setSelectedBlogId(id);
    setShowPermission(true);
  };

  // execute delete when confirmed
  const handleDelete = async () => {
    if (!selectedBlogId) return;
    try {
      const res = await fetch(
        `https://json-server-lnkp.onrender.com/blogs/${selectedBlogId}`,
        {
          method: "DELETE",
        }
      );
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

  const handleUpdate = (id) => {
    router.push(`/update/${id}`);
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
                <th>Description</th>
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
                    <td>{blog.description}</td>
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
