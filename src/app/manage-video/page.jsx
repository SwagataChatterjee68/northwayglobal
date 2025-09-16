"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import "./manage-video.css";

export default function ManageVideos() {
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const fileInputRef = useRef(null);

  // Load uploaded videos from localStorage on mount
  useEffect(() => {
    const storedVideos = localStorage.getItem("uploadedVideos");
    if (storedVideos) {
      setUploadedVideos(JSON.parse(storedVideos));
    }
  }, []);

  // Save uploaded videos to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("uploadedVideos", JSON.stringify(uploadedVideos));
  }, [uploadedVideos]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newVideos = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setSelectedVideos(newVideos);
  };

  const handleUpload = () => {
    if (!selectedVideos.length) {
      toast.error("No videos selected!");
      return;
    }
    setUploadedVideos((prev) => [...prev, ...selectedVideos]);
    setSelectedVideos([]);
    toast.success("Video(s) uploaded successfully!");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id) => {
    const updated = uploadedVideos.filter((v) => v.id !== id);
    setUploadedVideos(updated);
    toast.success("Video removed!");
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

      {uploadedVideos.length > 0 && (
        <div className="videos-grid">
          {uploadedVideos.map((video) => (
            <div key={video.id} className="video-item">
              <video
                src={video.url}
                className="video-preview"
                controls
              />
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
