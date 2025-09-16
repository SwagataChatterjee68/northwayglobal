"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import "./create-testimonial.css";

export default function CreateTestimonial() {
  const [formData, setFormData] = useState({ name: "", designation: "" });
  const [video, setVideo] = useState(null);
  const videoInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideo({
      id: Date.now(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    });
    console.log("Selected video:", file.name);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.designation ) {
    toast.error("Please fill all fields and select a video");
    return;
  }

  // Only build video object if it exists
  const testimonialData = {
    name: formData.name,
    designation: formData.designation,
    video: video
      ? {
          name: video.name,
          type: video.type,
          size: video.size,
          url: video.url,
        }
      : null,
  };

  try {
    const res = await fetch("https://json-server-lnkp.onrender.com/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testimonialData),
    });

    if (res.ok) {
      toast.success("Testimonial submitted successfully!");
      setFormData({ name: "", designation: "" });
      setVideo(null);
      if (videoInputRef.current) videoInputRef.current.value = "";
    } else {
      toast.error("Failed to submit testimonial");
    }
  } catch (err) {
    console.error(err);
    toast.error("Error connecting to server");
  }
};


  return (
    <div className="container">
      <h1 className="page-title">Create Testimonial</h1>

      <form onSubmit={handleSubmit} className="form-wrapper">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Enter designation"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Upload Video</label>
          <input
            type="file"
            accept="video/*"
            ref={videoInputRef}
            onChange={handleVideoChange}
            className="form-input"
          />
          {video && (
            <div className="video-preview">
              <video src={video.url} controls className="video-player" />
              <p className="video-name">{video.name}</p>
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
}
