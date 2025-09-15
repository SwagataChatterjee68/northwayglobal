"use client";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./manage-blog.css";
import { useRouter } from "next/navigation";

export default function ManageBlogs() {
  const router=useRouter();
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");

  const fetchBlogs = async () => {
    try {
      const res = await fetch("https://json-server-lnkp.onrender.com/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      } else {
        setMessage("Failed to fetch blogs");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await fetch(`https://json-server-lnkp.onrender.com/blogs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Blog deleted successfully");
        setBlogs(blogs.filter((blog) => blog.id !== id));
      } else {
        setMessage("Failed to delete blog");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    }
  };
  const handleUpdate = async (id) => {
    router.push(`/update/${id}`)
  }

  return (
    <div className="page-container">
      <main className="main-content">
        <h1 className="page-title">Manage Blogs</h1>
        {message && <p className="message">{message}</p>}

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
              {blogs.map((blog) => (
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
                      onClick={() => handleDelete(blog.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
