"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "sonner";
import PermissionBox from "@/components/modal/Permission";
import "./blog.css"; // Make sure you have this CSS file for styling

export default function UpdateBlog() {
  const params = useParams();
  // --- CHANGE 1: Destructure blog_id instead of id ---
  const { blog_id } = params;
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    writer: "",
    short_summary: "",
    thumbnail: null,
    pdf_file: null,
    content: "",
  });

  const [existingFiles, setExistingFiles] = useState({
    thumbnail: "",
    pdf: "",
  });

  const [loading, setLoading] = useState(true);
  const [showPermission, setShowPermission] = useState(false);

  useEffect(() => {
    // --- CHANGE 2: Check for blog_id ---
    if (!blog_id) return;
    async function fetchBlog() {
      try {
        // --- CHANGE 3: Use blog_id in the fetch URL ---
        const res = await fetch(`https://nortway.mrshakil.com/api/blogs/blog/${blog_id}/`);
        if (!res.ok) throw new Error("Blog not found.");

        const data = await res.json();
        setFormData({
          title: data.title || "",
          writer: data.writer || "",
          short_summary: data.short_summary || "",
          content: data.content || "",
          thumbnail: null,
          pdf_file: null,
        });
        setExistingFiles({
          thumbnail: data.thumbnail,
          pdf: data.pdf_file,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blog data");
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
    // --- CHANGE 4: Use blog_id in the dependency array ---
  }, [blog_id]);

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

  const confirmUpdate = async () => {
    const blogData = new FormData();
    blogData.append("title", formData.title);
    blogData.append("writer", formData.writer);
    blogData.append("short_summary", formData.short_summary);
    blogData.append("content", formData.content);

    if (formData.thumbnail) {
      blogData.append("thumbnail", formData.thumbnail);
    }
    if (formData.pdf_file) {
      blogData.append("pdf_file", formData.pdf_file);
    }

    try {
      // --- CHANGE 5: Use blog_id in the update URL ---
      const res = await fetch(`https://nortway.mrshakil.com/api/blogs/blog/${blog_id}/`, {
        method: "PUT",
        body: blogData,
      });

      if (res.ok) {
        toast.success("Blog updated successfully!");
        router.push("/manage-blogs");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update blog");
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
  
  if (loading) return <div>Loading...</div>;

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="form-wrapper">
          <h1 className="form-title">Update Blog</h1>
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
              <label className="form-label">Short Summary</label>
              <textarea
                name="short_summary"
                className="form-textarea"
                value={formData.short_summary}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Update Thumbnail</label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  className="form-input"
                  onChange={handleChange}
                />
                {existingFiles.thumbnail && (
                   <p className="file-info">Current: <a href={existingFiles.thumbnail} target="_blank" rel="noopener noreferrer">View Image</a></p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Update PDF File</label>
                <input
                  type="file"
                  name="pdf_file"
                  accept=".pdf"
                  className="form-input"
                  onChange={handleChange}
                />
                 {existingFiles.pdf && (
                   <p className="file-info">Current: <a href={existingFiles.pdf} target="_blank" rel="noopener noreferrer">View PDF</a></p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <Editor
                id="my-tinymce-editor"
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={formData.content}
                onEditorChange={handleEditorChange}
                init={{
                  height: 400,
                  menubar: false,
                  branding: false,
                  plugins: 'lists link media table code wordcount',
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic underline | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "link media | removeformat",
                }}
              />
            </div>

            <button type="submit" className="submit-btn">
              <FaPaperPlane /> Update Blog
            </button>
          </form>
        </div>
      </main>

      <PermissionBox
        isOpen={showPermission}
        onConfirm={confirmUpdate}
        onCancel={() => setShowPermission(false)}
        action="update"
      />
    </div>
  );
}