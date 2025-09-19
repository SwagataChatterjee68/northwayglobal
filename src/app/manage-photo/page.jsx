'use client'

import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import './manage-photo.css'
import Topbar from '@/components/topbar/Topbar'

export default function ManagePhotos () {
  const [photos, setPhotos] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const fileInputRef = useRef(null)

  const API_BASE = 'https://nortway.mrshakil.com/api/gallery/photo/'

  // Fetch existing photos
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Unauthorized! Please login first.')
      return
    }

    fetch(API_BASE, { headers: { Authorization: `Token ${token}` } })
      .then(res => res.json())
      .then(data =>
        setPhotos(
          data.map(p => ({
            ...p,
            photo: p.photo || '/placeholder.jpg', // fallback if photo is missing
            title: p.title || 'Untitled'
          }))
        )
      )
      .catch(err => console.error('Error fetching photos:', err))
  }, [])

  // Update previews for newly selected files
  useEffect(() => {
    const previewUrls = selectedFiles.map(file => URL.createObjectURL(file))
    setPreviews(previewUrls)

    return () => previewUrls.forEach(url => URL.revokeObjectURL(url))
  }, [selectedFiles])

  const handleFileChange = e => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
  }

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      toast.error('Please select photos first!')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Unauthorized! Please login first.')
      return
    }

    try {
      const uploadedPhotos = []

      for (const file of selectedFiles) {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('title', file.name)

        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { Authorization: `Token ${token}` },
          body: formData
        })

        console.log(res , "check the response")

        if (!res.ok) {
          const errData = await res.json()
          toast.error(errData.detail || 'Failed to upload photo')
          continue
        }

        const savedPhoto = await res.json()
        uploadedPhotos.push({
          ...savedPhoto,
          photo: savedPhoto.photo || '/placeholder.jpg',
          title: savedPhoto.title || file.name
        })
      }

      setPhotos(prev => [...prev, ...uploadedPhotos])
      setSelectedFiles([])
      setPreviews([])
      if (fileInputRef.current) fileInputRef.current.value = ''
      toast.success('Photo(s) uploaded successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Error uploading photo(s)')
    }
  }

  const handleDelete = async id => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Unauthorized! Please login first.')
      return
    }

    try {
      const res = await fetch(`${API_BASE}${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` }
      })

      if (res.ok) {
        setPhotos(prev => prev.filter(p => p.id !== id))
        toast.success('Photo deleted!')
      } else {
        const errData = await res.json()
        toast.error(errData.detail || 'Failed to delete photo')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error deleting photo')
    }
  }

  return (
    <section>
      <Topbar />
      <div className='container'>
        <h1 className='page-title'>Manage Photos</h1>

        {/* Upload Section */}
        <div className='input-wrapper'>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            multiple
            onChange={handleFileChange}
            className='file-input'
          />
          <button onClick={handleUpload} className='submit-btn'>
            Upload
          </button>
        </div>

        {/* Previews for newly selected files */}
        {previews.length > 0 && (
          <div className='photos-grid'>
            {previews.map((url, idx) => (
              <div key={idx} className='photo-item'>
                <img
                  src={url}
                  alt={selectedFiles[idx]?.name || 'Preview'}
                  className='photo-img'
                />
                <p className='photo-name'>
                  {selectedFiles[idx]?.name || 'Preview'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Show uploaded photos */}
        {photos.length > 0 && (
          <div className='photos-grid'>
            {photos.map(photo => (
              <div key={photo.id} className='photo-item'>
                <img
                  src={
                    photo.photo?.startsWith('http')
                      ? photo.photo
                      : `https://nortway.mrshakil.com${photo.photo}`
                  }
                  alt={photo.title}
                  className='photo-img'
                />
                <p className='photo-name'>{photo.title}</p>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className='photo-delete'
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
