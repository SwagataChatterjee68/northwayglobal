"use client";
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "sonner";
import "../globals.css";
import PermissionBox from "@/components/modal/Permission";
import "./create.css";

export default function CreateBlog() {
  // Change 1: Updated state keys to match the API's JSON structure.
  // 'description' -> 'short_summary', 'image' -> 'thumbnail', and added 'pdf_file'.
  const [formData, setFormData] = useState({
    title: "",
    writer: "",
    short_summary: "",
    content: "",
    pdf_file: null,
    thumbnail: null,
  });

  const [showPermission, setShowPermission] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  // Change 2: Switched to FormData for file uploads.
  // This is crucial because you're sending files, not just JSON.
  const confirmCreate = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("writer", formData.writer);
    data.append("short_summary", formData.short_summary);
    data.append("content", formData.content);

    // Conditionally append files if they exist.
    if (formData.thumbnail) {
      data.append("thumbnail", formData.thumbnail);
    }
    if (formData.pdf_file) {
      data.append("pdf_file", formData.pdf_file);
    }

    try {
      // Change 3: Updated the API endpoint and removed the Content-Type header.
      // The browser automatically sets the correct 'multipart/form-data' header when you send FormData.
      const res = await fetch("https://nortway.mrshakil.com/api/blogs/blog/", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        toast.success("Blog created successfully!");
        // Change 4: Reset the state with the updated keys.
        setFormData({
          title: "",
          writer: "",
          short_summary: "",
          content: "",
          pdf_file: null,
          thumbnail: null,
        });
        // You might need to clear the file input fields manually if the browser doesn't.
        document.querySelector('form').reset();
      } else {
        toast.error("Failed to create blog");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    } finally {
      setShowPermission(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPermission(true);
  };

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="form-wrapper">
          <h1 className="form-title">Create New Blog</h1>
          <p className="form-subtitle">
            Fill in the details below to publish your blog.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Writer */}
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

            {/* Change 5: Updated the textarea to match the 'short_summary' state key. */}
            <div className="form-group">
              <label className="form-label">Short Summary</label>
              <textarea
                name="short_summary"
                className="form-textarea"
                value={formData.short_summary}
                onChange={handleChange}
                required
              />
            </div>

            {/* Change 6: Updated file inputs for 'thumbnail' and added one for 'pdf_file'. */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Upload Thumbnail</label>
                <input
                  type="url"
                  name="thumbnail"
                  placeholder="Image URL"
                  className="form-input"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Upload PDF (Optional)</label>
                <input
                  type="url"
                  name="pdf_file"
                  placeholder="PDF URL"
                  className="form-input"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Editor */}
            <div className="form-group">
              <label className="form-label">Start Writing</label>
              <Editor
                id="my-tinymce-editor"
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={formData.content}
                onEditorChange={handleEditorChange}
                init={{
                  height: 500, // Added for better default size
                  menubar: false,
                  branding: false,
                  plugins: "anchor autolink charmap codesample emoticons link lists media searchreplace table visualblocks wordcount checklist",
                  toolbar: "undo redo | blocks | bold italic underline strikethrough | link media table | align | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                }}
              />
            </div>
            <button type="submit" className="submit-btn">
              <FaPaperPlane /> Submit Blog
            </button>
          </form>
        </div>
      </main>
      <PermissionBox
        isOpen={showPermission}
        onConfirm={confirmCreate}
        onCancel={() => setShowPermission(false)}
        action="create"
      />
    </div>
  );
}