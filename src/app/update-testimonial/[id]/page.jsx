"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import "./update-testimonial.css";

export default function UpdateTestimonial() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    video: null,
  });

  const [preview, setPreview] = useState(null);

  // Fetch existing testimonial
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`https://json-server-lnkp.onrender.com/testimonials/${id}`);
        const data = await res.json();
        setFormData({
          name: data.name || "",
          designation: data.designation || "",
          video: null,
        });
        setPreview(data.video?.url || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load testimonial");
      }
    }
    fetchData();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, video: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.designation) {
      toast.error("Please fill in all fields");
      return;
    }

    const updatedData = {
      name: formData.name,
      designation: formData.designation,
      video: preview ? { url: preview, name: formData.video?.name } : null,
    };

    try {
      const res = await fetch(`https://json-server-lnkp.onrender.com/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        toast.success("Testimonial updated successfully!");
        router.push("/manage-testimonial");
      } else {
        toast.error("Failed to update testimonial");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Update Testimonial</h1>

      <form onSubmit={handleSubmit} className="form-wrapper">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter designation"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Upload Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {preview && (
          <video controls className="preview-video">
            <source src={preview} type="video/mp4" />
          </video>
        )}

        <button type="submit" className="submit-btn">
          Update Testimonial
        </button>
      </form>
    </div>
  );
}
