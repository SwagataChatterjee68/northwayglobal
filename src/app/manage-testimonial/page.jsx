"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import "./manage-testimonial.css";

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([]);

  // Fetch all testimonials
  useEffect(() => {
    fetch("https://json-server-lnkp.onrender.com/testimonials")
      .then((res) => res.json())
      .then((data) => setTestimonials(data))
      .catch((err) => console.error(err));
  }, []);

  // Delete testimonial
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://json-server-lnkp.onrender.com/testimonials/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        toast.success("Testimonial deleted!");
      } else {
        toast.error("Failed to delete testimonial");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting testimonial");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Manage Testimonials</h1>

      {testimonials.length === 0 ? (
        <p className="empty-text">Loading...</p>
      ) : (
        <div className="card-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card">
              <h2 className="card-title">{t.name}</h2>
              <p className="card-designation">{t.designation}</p>

              {t.video?.url && (
                <video controls className="card-video">
                  <source src={t.video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              <div className="card-actions">
                <Link href={`/update-testimonial/${t.id}`}>
                  <button className="update-btn">Update</button>
                </Link>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
