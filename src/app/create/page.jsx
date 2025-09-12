
"use client";

import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import "../globals.css"; 
import "./create.css"; 
export default function CreateBlog() {
  const [formData, setFormData] = useState({
    title: "",
    writer: "",
    description: "",
    image: null,
    content: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedContent = `<p>${formData.content}</p>`;

    const blogData = {
      title: formData.title,
      writer: formData.writer,
      description: formData.description,
      image: formData.image ? formData.image.name : null,
      content: formattedContent,
    };

    console.log("Blog Submitted:", blogData);

    // ✅ Reset form after submit
    setFormData({
      title: "",
      writer: "",
      description: "",
      image: null,
      content: "",
    });

    // Optionally: reset file input too
    e.target.reset();
  };

  return (
    <div className="layout">
      {/* --- Main Content --- */}
      <main className="main">
        <div className="form-wrapper">
          <h1 className="form-title">Create New Blog</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blog Title */}
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

            {/* Writer Name */}
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

            {/* Short Description */}
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

            {/* Upload Image */}
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

            {/* Editor */}
            <div className="form-group">
              <label className="form-label">Start Writing</label>
              <textarea
                name="content"
                className="editor"
                placeholder="Write your blog content here..."
                value={formData.content}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit */}
            <button type="submit" className="submit-btn">
              <FaPaperPlane /> Submit Blog
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
