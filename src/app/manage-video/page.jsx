'use client'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import './manage-video.css'
import Topbar from '@/components/topbar/Topbar'

export default function ManageVideos () {
  const [videos, setVideos] = useState([])
  const [selectedVideos, setSelectedVideos] = useState([])
  const fileInputRef = useRef(null)

  // Fetch videos from backend
  useEffect(() => {
    fetch('https://nortway.mrshakil.com/api/gallery/video')
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error('Error fetching videos:', err))
  }, [])

  // Select files
  const handleFileChange = e => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    const newVideos = files.map(file => ({
      title: file.name, // title instead of name
      videoUrl: URL.createObjectURL(file) // videoUrl instead of url
    }))

    setSelectedVideos(newVideos)
  }

  // Upload selected videos
  const handleUpload = async () => {
    if (!selectedVideos.length) {
      toast.error('Please select videos first!')
      return
    }

    try {
      for (const video of selectedVideos) {
        const res = await fetch(
          'https://nortway.mrshakil.com/api/gallery/video',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: video.title,
              videoUrl: video.videoUrl
            })
          }
        )

        if (!res.ok) throw new Error('Upload failed')

        const savedVideo = await res.json()
        setVideos(prev => [...prev, savedVideo])
      }

      setSelectedVideos([])
      toast.success('Video(s) uploaded successfully!')

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error(err)
      toast.error('Error uploading video(s)')
    }
  }

  // Delete video
  const handleDelete = async id => {
    try {
      await fetch(`https://nortway.mrshakil.com/api/gallery/video/${id}`, {
        method: 'DELETE'
      })
      setVideos(videos.filter(v => v.id !== id))
      toast.success('Video deleted!')
    } catch (err) {
      console.error(err)
      toast.error('Error deleting video')
    }
  }

  return (
    <section>
      <Topbar />
      <div className='container'>
        <div>
          <h1 className='page-title'>Manage Videos</h1>

          <div className='input-wrapper'>
            <input
              ref={fileInputRef}
              type='file'
              accept='video/*'
              multiple
              onChange={handleFileChange}
              className='file-input'
            />
            <button onClick={handleUpload} className='submit-btn'>
              Upload
            </button>
          </div>

          {/* Show uploaded videos */}
          {videos.length > 0 && (
            <div className='videos-grid'>
              {videos.map(video => (
                <div key={video.id} className='video-item'>
                  <video
                    src={video.videoUrl}
                    controls
                    className='video-preview'
                  />
                  <p className='video-name'>{video.title}</p>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className='video-delete'
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
