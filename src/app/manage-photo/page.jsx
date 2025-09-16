"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import "./manage-photo.css";

export default function ManagePhotos() {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const fileInputRef = useRef(null); // reference to clear input

  // Load uploaded photos from localStorage on mount
  useEffect(() => {
    const storedPhotos = localStorage.getItem("uploadedPhotos");
    if (storedPhotos) {
      setUploadedPhotos(JSON.parse(storedPhotos));
    }
  }, []);

  // Save uploaded photos to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("uploadedPhotos", JSON.stringify(uploadedPhotos));
  }, [uploadedPhotos]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPhotos = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setSelectedPhotos(newPhotos);
  };

  const handleUpload = () => {
    if (!selectedPhotos.length) {
      toast.error("No photos selected!");
      return;
    }
    setUploadedPhotos((prev) => [...prev, ...selectedPhotos]);
    setSelectedPhotos([]);
    toast.success("Photo(s) uploaded successfully!");

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id) => {
    const updated = uploadedPhotos.filter((p) => p.id !== id);
    setUploadedPhotos(updated);
    toast.success("Photo removed!");
  };

  return (
    <div className="container">
      <h1 className="page-title">Manage Photos</h1>

      {/* File input */}
      <div className="input-wrapper">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="file-input"
        />
        <button onClick={handleUpload} className="submit-btn">
          Upload Photos
        </button>
      </div>

      {/* Show uploaded photos in grid */}
      {uploadedPhotos.length > 0 && (
        <div className="photos-grid">
          {uploadedPhotos.map((photo) => (
            <div key={photo.id} className="photo-item">
              <img src={photo.url} alt={photo.name} className="photo-img" />
              <button
                onClick={() => handleDelete(photo.id)}
                className="photo-delete"
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
