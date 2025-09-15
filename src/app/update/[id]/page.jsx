"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import "./update.css";

export default function UpdateBlog() {
  const params = useParams();
  const { id } = params; // Get blog ID from URL
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    writer: "",
    description: "",
    image: null,
    content: "",
  });
  const [message, setMessage] = useState("");

  // Fetch blog data on mount
  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`http://localhost:5000/blogs/${id}`);
        const data = await res.json();
        setFormData({
          title: data.title || "",
          writer: data.writer || "",
          description: data.description || "",
          image: null,
          content: data.content ? data.content.replace(/<\/?p>/g, "") : "",
        });
      } catch (err) {
        console.error(err);
        setMessage("⚠️ Failed to load blog data");
      }
    }
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedContent = `<p>${formData.content}</p>`;
    const blogData = {
      title: formData.title,
      writer: formData.writer,
      description: formData.description,
      image: formData.image ? formData.image.name : null,
      content: formattedContent,
    };

    try {
      const res = await fetch(`https://json-server-lnkp.onrender.com/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });
      if (res.ok) {
        setMessage("Blog updated successfully!");
        router.push("/manage"); // Redirect after update
      } else {
        setMessage("Failed to update blog");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="page-container">
      {/* Main Content */}
      <main className="main-content">
        <div className="form-wrapper">
          <h1 className="form-title">Update Blog</h1>
          {message && <p className="message">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Blog Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Writer Name</label>
                <input
                  type="text"
                  name="writer"
                  className="form-input"
                  value={formData.writer}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Short Description</label>
              <textarea
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="form-input"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Start Writing</label>
              <textarea
                name="content"
                className="form-textarea"
                placeholder="Write your blog content here..."
                value={formData.content}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              <FaPaperPlane /> Update Blog
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
