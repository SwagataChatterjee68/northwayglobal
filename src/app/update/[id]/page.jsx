"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "sonner";
import "./update.css";

export default function UpdateBlog() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    writer: "",
    description: "",
    image: null,
    content: "",
  });

  // Fetch blog data on mount
  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`https://json-server-lnkp.onrender.com/blogs/${id}`);
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
        toast.error("Failed to load blog data");
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

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
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
        toast.success("Blog updated successfully!");
        router.push("/manage"); // Redirect after update
      } else {
        toast.error("Failed to update blog");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    }
  };

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
              <Editor
                id="my-tinymce-editor"
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={formData.content}
                onEditorChange={handleEditorChange}
                init={{
                  menubar: false,
                  branding: false,
                  plugins: [
                    "anchor",
                    "autolink",
                    "charmap",
                    "codesample",
                    "emoticons",
                    "link",
                    "lists",
                    "media",
                    "searchreplace",
                    "table",
                    "visualblocks",
                    "wordcount",
                    "checklist",
                    "mediaembed",
                    "casechange",
                    "formatpainter",
                    "pageembed",
                    "a11ychecker",
                    "tinymcespellchecker",
                    "permanentpen",
                    "powerpaste",
                    "advtable",
                    "advcode",
                    "advtemplate",
                    "mentions",
                    "tableofcontents",
                    "footnotes",
                    "mergetags",
                    "autocorrect",
                    "typography",
                    "inlinecss",
                    "markdown",
                    "importword",
                    "exportword",
                    "exportpdf",
                  ],
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | " +
                    "bold italic underline strikethrough | link media table mergetags | " +
                    "align lineheight | checklist numlist bullist indent outdent | " +
                    "emoticons charmap | removeformat",
                }}
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
