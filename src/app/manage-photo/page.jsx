"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import "./manage-photo.css";

export default function ManagePhotos() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const fileInputRef = useRef(null);

  // Fetch photos from json-server
  useEffect(() => {
    fetch("https://json-server-lnkp.onrender.com/photos")
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error("Error fetching photos:", err));
  }, []);

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

  const handleUpload = async () => {
    if (!selectedPhotos.length) {
      toast.error("Please select photos first!");
      return;
    }

    try {
      for (const photo of selectedPhotos) {
        await fetch("https://json-server-lnkp.onrender.com/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(photo),
        });
      }

      setPhotos((prev) => [...prev, ...selectedPhotos]);
      setSelectedPhotos([]);
      toast.success("Photo(s) uploaded successfully!");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading photo(s)");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://json-server-lnkp.onrender.com/photos/${id}`, {
        method: "DELETE",
      });
      setPhotos(photos.filter((p) => p.id !== id));
      toast.success("Photo deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting photo");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Manage Photos</h1>

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
          Upload
        </button>
      </div>

      {/* Show uploaded photos */}
      {photos.length > 0 && (
        <div className="photos-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-item">
              <img src={photo.url} alt={photo.name} className="photo-img" />
              <p className="photo-name">{photo.name}</p>
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
