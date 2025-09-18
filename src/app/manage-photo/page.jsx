"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import "./manage-photo.css";

export default function ManagePhotos() {
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const titleRef = useRef(null);
  const fileRef = useRef(null);

  // Get token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch photos from backend
  useEffect(() => {
    if (!token) {
      toast.error("No token found. Please login first.");
      return;
    }

    fetch("https://nortway.mrshakil.com/api/gallery/photo/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or fetch failed");
        return res.json();
      })
      .then((data) =>
        setPhotos(
          data.map((p) => ({
            ...p,
            photo: p.photo ? `https://nortway.mrshakil.com${p.photo}` : null,
          }))
        )
      )
      .catch((err) => console.error("Error fetching photos:", err));
  }, [token]);

  // Upload photo
  const handleUpload = async () => {
    if (!title || !file) {
      toast.error("Please enter title and select a photo!");
      return;
    }
    if (!token) {
      toast.error("No token found. Please login first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", file);

      const res = await fetch("https://nortway.mrshakil.com/api/gallery/photo/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const savedPhoto = await res.json();
      setPhotos((prev) => [
        ...prev,
        {
          ...savedPhoto,
          photo: savedPhoto.photo
            ? `https://nortway.mrshakil.com${savedPhoto.photo}`
            : null,
        },
      ]);

      setTitle("");
      setFile(null);
      if (titleRef.current) titleRef.current.value = "";
      if (fileRef.current) fileRef.current.value = "";

      toast.success("Photo uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error uploading photo");
    }
  };

  // Delete photo
  const handleDelete = async (id) => {
    if (!token) {
      toast.error("No token found. Please login first.");
      return;
    }

    try {
      await fetch(`https://nortway.mrshakil.com/api/gallery/photo/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          ref={titleRef}
          type="text"
          placeholder="Enter photo title"
          onChange={(e) => setTitle(e.target.value)}
          className="file-input"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
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
              {photo.photo ? (
                <img src={photo.photo} alt={photo.title} className="photo-preview" />
              ) : (
                <div className="photo-missing">No image</div>
              )}
              <p className="photo-name">{photo.title}</p>
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
