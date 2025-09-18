"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import "./manage-video.css";

export default function ManageVideos() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const titleRef = useRef(null);
  const urlRef = useRef(null);

  // Get token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch videos from backend
  useEffect(() => {
    if (!token) {
      toast.error("No token found. Please login first.");
      return;
    }

    fetch("https://nortway.mrshakil.com/api/gallery/video/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or fetch failed");
        return res.json();
      })
      .then((data) => setVideos(data))
      .catch((err) => console.error("Error fetching videos:", err));
  }, [token]);

  // Upload video
  const handleUpload = async () => {
    if (!title || !videoUrl) {
      toast.error("Please enter title and video URL!");
      return;
    }
    if (!token) {
      toast.error("No token found. Please login first.");
      return;
    }

    try {
      const res = await fetch("https://nortway.mrshakil.com/api/gallery/video/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          video_url: videoUrl,
        }),
      });

      if (!res.ok) throw new Error("Upload failed");

      const savedVideo = await res.json();
      setVideos((prev) => [...prev, savedVideo]);

      setTitle("");
      setVideoUrl("");
      if (titleRef.current) titleRef.current.value = "";
      if (urlRef.current) urlRef.current.value = "";

      toast.success("Video uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error uploading video");
    }
  };

  // Delete video
  const handleDelete = async (id) => {
    if (!token) {
      toast.error("No token found. Please login first.");
      return;
    }

    try {
      await fetch(`https://nortway.mrshakil.com/api/gallery/video/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVideos(videos.filter((v) => v.id !== id));
      toast.success("Video deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting video");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Manage Videos</h1>

      <div className="input-wrapper">
        <input
          ref={titleRef}
          type="text"
          placeholder="Enter video title"
          onChange={(e) => setTitle(e.target.value)}
          className="file-input"
        />
        <input
          ref={urlRef}
          type="text"
          placeholder="Enter video URL"
          onChange={(e) => setVideoUrl(e.target.value)}
          className="file-input"
        />
        <button onClick={handleUpload} className="submit-btn">
          Upload
        </button>
      </div>

      {/* Show uploaded videos */}
      {videos.length > 0 && (
        <div className="videos-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-item">
              <video src={video.video_url} controls className="video-preview" />
              <p className="video-name">{video.title}</p>
              <button
                onClick={() => handleDelete(video.id)}
                className="video-delete"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
