"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./dashboard.css"; // Tailwind @apply styles

export default function Dashboard() {
  const [testimonials, setTestimonials] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Fetch data from json-server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimonialRes, photoRes, videoRes, blogRes] = await Promise.all([
          fetch("https://json-server-lnkp.onrender.com/testimonials"),
          fetch("https://json-server-lnkp.onrender.com/photos"),
          fetch("https://json-server-lnkp.onrender.com/videos"),
          fetch("https://json-server-lnkp.onrender.com/blogs"),
        ]);

        const [testimonialData, photoData, videoData, blogData] =
          await Promise.all([
            testimonialRes.json(),
            photoRes.json(),
            videoRes.json(),
            blogRes.json(),
          ]);

        setTestimonials(testimonialData.slice(-5).reverse());
        setPhotos(photoData.slice(-5).reverse());
        setVideos(videoData.slice(-5).reverse());
        setBlogs(blogData.slice(-5).reverse());
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1 className="page-title">Dashboard</h1>

      {/* Testimonials */}
      <section className="section">
        <h2 className="section-title">Latest Testimonials</h2>
        <div className="grid">
          {testimonials.map((t) => (
            <div key={t.id} className="card">
              <p className="card-title">{t.name}</p>
              <p className="card-subtitle">{t.designation}</p>
              <video controls className="video">
                <source src={t.video?.url} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>
        <Link href="/manage-testimonial" className="view-more">
          View All
        </Link>
      </section>

      {/* Photos */}
      <section className="section">
        <h2 className="section-title">Recent Photos</h2>
        <div className="grid">
          {photos.map((p) => (
            <div key={p.id} className="card">
              <img src={p.url} alt={p.name} className="photo" />
              <p className="card-subtitle">{p.name}</p>
            </div>
          ))}
        </div>
        <Link href="/manage-photos" className="view-more">
          View All
        </Link>
      </section>

      {/* Videos */}
      <section className="section">
        <h2 className="section-title">Recent Videos</h2>
        <div className="grid">
          {videos.map((v) => (
            <div key={v.id} className="card">
              <video controls className="video">
                <source src={v.url} type="video/mp4" />
              </video>
              <p className="card-subtitle">{v.name}</p>
            </div>
          ))}
        </div>
        <Link href="/manage-videos" className="view-more">
          View All
        </Link>
      </section>

      {/* Blogs */}
      <section className="section">
        <h2 className="section-title">Recent Blogs</h2>
        <div className="grid">
          {blogs.map((b) => (
            <div key={b.id} className="card">
              <p className="card-title">{b.title}</p>
              <p className="card-subtitle">By {b.author}</p>
              <p className="card-desc">{b.content.substring(0, 80)}...</p>
            </div>
          ))}
        </div>
        <Link href="/manage-blogs" className="view-more">
          View All
        </Link>
      </section>
    </div>
  );
}
