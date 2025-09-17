"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import "./manage-video.css";

export default function ManageVideos() {
  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const fileInputRef = useRef(null);

  // Fetch videos from json-server
  useEffect(() => {
    fetch("https://json-server-lnkp.onrender.com/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newVideos = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file), // preview only
    }));

    setSelectedVideos(newVideos);
  };

  const handleUpload = async () => {
    if (!selectedVideos.length) {
      toast.error("Please select videos first!");
      return;
    }

    try {
      for (const video of selectedVideos) {
        await fetch("https://json-server-lnkp.onrender.com/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(video),
        });
      }

      setVideos((prev) => [...prev, ...selectedVideos]);
      setSelectedVideos([]);
      toast.success("Video(s) uploaded successfully!");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading video(s)");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://json-server-lnkp.onrender.com/videos/${id}`, {
        method: "DELETE",
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
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileChange}
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
              <video src={video.url} controls className="video-preview" />
              <p className="video-name">{video.name}</p>
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
